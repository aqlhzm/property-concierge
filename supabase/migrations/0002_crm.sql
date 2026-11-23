-- Property Concierge — Phase 2, step 1: CRM schema and spam protection
-- Applied while public.leads had 0 rows, so status values and columns change freely.
--
-- * Clean status keys (no dashes); the UI maps them to labels.
-- * journey_stage is derived from status (generated), never typed.
-- * CRM fields: priority, assignment, next action, follow-up time, timestamps, shortlist.
-- * Consent and identity columns are locked after insert (PDPA evidence).
-- * staff and lead_activities tables (RLS on; policies arrive with staff sign-in).
-- * submit_lead gains a rate limit (per hashed client and per phone) and a duplicate guard.

------------------------------------------------------------------------------
-- Staff (who may use /admin). Policies are added with sign-in (0003).
------------------------------------------------------------------------------
create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'agent' check (role in ('owner', 'agent')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;
revoke all on public.staff from anon, authenticated;

------------------------------------------------------------------------------
-- Leads: CRM columns
------------------------------------------------------------------------------
alter table public.leads drop constraint if exists leads_status_check;
update public.leads set status = case status
  when 'New' then 'new' when 'Contacted' then 'contacted'
  when 'Consultation booked' then 'consultation_booked' when 'Viewing booked' then 'viewing_booked'
  when 'Viewed' then 'viewed' when 'Booking' then 'booking' when 'SPA' then 'spa'
  when 'Closed - purchased' then 'purchased' when 'Closed - not proceeding' then 'not_proceeding'
  when 'On hold' then 'on_hold' else 'new' end;
alter table public.leads alter column status set default 'new';
alter table public.leads add constraint leads_status_check check (status in (
  'new', 'contacted', 'consultation_booked', 'viewing_booked', 'viewed',
  'booking', 'spa', 'purchased', 'not_proceeding', 'on_hold'
));

alter table public.leads
  drop column if exists journey_stage,
  drop column if exists lead_category,
  drop column if exists next_action,
  drop column if exists next_follow_up_date,
  drop column if exists last_contact_date,
  drop column if exists notes;

alter table public.leads
  add column journey_stage text generated always as (
    case status
      when 'new' then 'Qualify'
      when 'contacted' then 'Qualify'
      when 'consultation_booked' then 'Experience'
      when 'viewing_booked' then 'Experience'
      when 'viewed' then 'Experience'
      when 'booking' then 'Purchase'
      when 'spa' then 'Purchase'
      when 'purchased' then 'Handover'
      else null -- not_proceeding / on_hold: no active stage
    end
  ) stored,
  add column priority text check (priority in ('hot', 'warm', 'cold')),
  add column assigned_to uuid references public.staff (user_id) on delete set null,
  add column next_action text check (next_action is null or char_length(next_action) <= 200),
  add column next_follow_up_at timestamptz,
  add column last_contacted_at timestamptz,
  add column updated_at timestamptz not null default now(),
  add column archived_at timestamptz,
  add column shortlist jsonb check (shortlist is null or (jsonb_typeof(shortlist) = 'array' and jsonb_array_length(shortlist) <= 12));

create index if not exists leads_follow_up_idx on public.leads (next_follow_up_at) where archived_at is null;
create index if not exists leads_priority_idx on public.leads (priority);
create index if not exists leads_phone_digits_idx on public.leads ((regexp_replace(phone, '\D', '', 'g')), created_at desc);

-- updated_at, and lock consent + identity columns after insert
create or replace function public.leads_before_update()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.lead_code is distinct from old.lead_code
     or new.created_at is distinct from old.created_at
     or new.consent_given is distinct from old.consent_given
     or new.consent_text is distinct from old.consent_text
     or new.consent_version is distinct from old.consent_version
     or new.consent_timestamp is distinct from old.consent_timestamp then
    raise exception 'consent and identity fields cannot be changed' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists leads_before_update on public.leads;
create trigger leads_before_update before update on public.leads
  for each row execute function public.leads_before_update();

------------------------------------------------------------------------------
-- Timeline (append only: staff may insert and read, never edit or delete)
------------------------------------------------------------------------------
create table if not exists public.lead_activities (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  staff_id uuid references public.staff (user_id) on delete set null,
  created_at timestamptz not null default now(),
  type text not null check (type in (
    'note', 'call', 'whatsapp', 'email', 'meeting', 'viewing',
    'status_change', 'priority_change', 'follow_up_set', 'assigned', 'created'
  )),
  body text check (body is null or char_length(body) <= 4000),
  meta jsonb not null default '{}'::jsonb
);
create index if not exists lead_activities_lead_idx on public.lead_activities (lead_id, created_at desc);
alter table public.lead_activities enable row level security;
revoke all on public.lead_activities from anon, authenticated;

------------------------------------------------------------------------------
-- Spam protection
------------------------------------------------------------------------------
create table if not exists public.lead_throttle (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_throttle_key_idx on public.lead_throttle (key, created_at desc);
alter table public.lead_throttle enable row level security;
revoke all on public.lead_throttle from anon, authenticated;

------------------------------------------------------------------------------
-- submit_lead v2: rate limit, duplicate guard, optional shortlist
--   payload.client_key: SHA-256 of the visitor's IP, hashed on the server (never the raw IP)
--   Limits: 5 per client per hour, 3 per phone per 24 hours.
--   Same phone + intent + development within 10 minutes returns the existing reference.
--   Over the limit: raises SQLSTATE P0429 (the site shows the WhatsApp fallback).
------------------------------------------------------------------------------
create or replace function public.submit_lead(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  code text := 'PC-' || to_char(now() at time zone 'Asia/Kuala_Lumpur', 'YYYYMMDD') || '-' ||
               upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  phone_digits text := regexp_replace(coalesce(payload->>'phone', ''), '\D', '', 'g');
  client text := left(nullif(payload->>'client_key', ''), 128);
  existing text;
  new_id uuid;
  sl jsonb := null;
begin
  if coalesce((payload->>'consent_given')::boolean, false) is not true then
    raise exception 'consent required' using errcode = '22023';
  end if;

  -- Duplicate guard: a double submit returns the reference already given
  select l.lead_code into existing
  from public.leads l
  where regexp_replace(l.phone, '\D', '', 'g') = phone_digits
    and l.intent = payload->>'intent'
    and coalesce(l.project_slug, '') = coalesce(nullif(payload->>'project_slug', ''), '')
    and l.created_at > now() - interval '10 minutes'
  order by l.created_at desc
  limit 1;
  if existing is not null then
    return existing;
  end if;

  -- Rate limits
  if client is not null and (
    select count(*) from public.lead_throttle t
    where t.key = 'c:' || client and t.created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'rate limited' using errcode = 'P0429';
  end if;
  if (
    select count(*) from public.lead_throttle t
    where t.key = 'p:' || phone_digits and t.created_at > now() - interval '24 hours'
  ) >= 3 then
    raise exception 'rate limited' using errcode = 'P0429';
  end if;

  -- Optional shortlist: up to 12 short unit ids
  if jsonb_typeof(payload->'shortlist') = 'array' then
    select coalesce(jsonb_agg(left(v, 40)), '[]'::jsonb) into sl
    from (select jsonb_array_elements_text(payload->'shortlist') as v limit 12) s
    where v ~ '^[a-z0-9-]{1,40}$';
    if sl = '[]'::jsonb then sl := null; end if;
  end if;

  insert into public.leads (
    lead_code, full_name, phone, email, preferred_contact, intent,
    project_slug, project_name, unit_type_id, unit_type_name,
    preferred_viewing_date, preferred_viewing_time, message,
    dream_desire, dream_readiness, dream_eligibility, dream_affordability, dream_match,
    consent_given, consent_text, consent_version,
    cta_source, utm_source, utm_medium, utm_campaign, shortlist
  ) values (
    code,
    payload->>'full_name',
    payload->>'phone',
    nullif(payload->>'email', ''),
    coalesce(nullif(payload->>'preferred_contact', ''), 'WhatsApp'),
    payload->>'intent',
    left(nullif(payload->>'project_slug', ''), 80),
    left(nullif(payload->>'project_name', ''), 120),
    left(nullif(payload->>'unit_type_id', ''), 40),
    left(nullif(payload->>'unit_type_name', ''), 120),
    nullif(payload->>'preferred_viewing_date', '')::date,
    left(nullif(payload->>'preferred_viewing_time', ''), 40),
    nullif(payload->>'message', ''),
    left(nullif(payload->>'dream_desire', ''), 80),
    left(nullif(payload->>'dream_readiness', ''), 80),
    left(nullif(payload->>'dream_eligibility', ''), 80),
    left(nullif(payload->>'dream_affordability', ''), 120),
    left(nullif(payload->>'dream_match', ''), 200),
    true,
    left(payload->>'consent_text', 500),
    left(payload->>'consent_version', 40),
    left(nullif(payload->>'cta_source', ''), 120),
    left(nullif(payload->>'utm_source', ''), 100),
    left(nullif(payload->>'utm_medium', ''), 100),
    left(nullif(payload->>'utm_campaign', ''), 100),
    sl
  ) returning id into new_id;

  insert into public.lead_activities (lead_id, type, body, meta)
  values (new_id, 'created', 'Enquiry received from the website',
          jsonb_build_object('intent', payload->>'intent', 'cta', nullif(payload->>'cta_source', '')));

  insert into public.lead_throttle (key) values ('p:' || phone_digits);
  if client is not null then
    insert into public.lead_throttle (key) values ('c:' || client);
  end if;
  -- Keep the throttle table small
  delete from public.lead_throttle where created_at < now() - interval '2 days';

  return code;
end;
$$;

revoke all on function public.submit_lead(jsonb) from public;
revoke all on function public.submit_lead(jsonb) from authenticated;
grant execute on function public.submit_lead(jsonb) to anon, service_role;

revoke all on function public.leads_before_update() from public, anon, authenticated;
