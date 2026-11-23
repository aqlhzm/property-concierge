-- Property Concierge — lead capture (Phase 1)
-- Mirrors the Base44 Lead entity. RLS is enabled with NO policies, so the table cannot be
-- read or written through the API by anon/authenticated roles. The only way in is the
-- submit_lead() function below (security definer), called from the Next.js server.
-- Read leads in the Supabase dashboard or a future admin app.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_code text not null unique,
  created_at timestamptz not null default now(),

  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text not null check (char_length(phone) between 8 and 20),
  email text check (email is null or char_length(email) <= 200),
  preferred_contact text not null default 'WhatsApp' check (preferred_contact in ('WhatsApp', 'Call', 'Email')),

  intent text not null check (intent in (
    'General enquiry', 'Viewing request', 'Consultation', 'Price & availability',
    'Financing discussion', 'Recommendation request'
  )),
  project_slug text,
  project_name text,
  unit_type_id text,
  unit_type_name text,
  preferred_viewing_date date,
  preferred_viewing_time text,
  message text check (message is null or char_length(message) <= 1000),

  -- D.R.E.A.M. qualification (buyer-stated, optional)
  dream_desire text,
  dream_readiness text,
  dream_eligibility text,
  dream_affordability text,
  dream_match text,

  -- Consent (PDPA)
  consent_given boolean not null check (consent_given),
  consent_text text not null,
  consent_version text not null,
  consent_timestamp timestamptz not null default now(),

  -- Attribution
  cta_source text,
  source_channel text not null default 'Website',
  utm_source text,
  utm_medium text,
  utm_campaign text,

  -- CRM (Phase 2)
  status text not null default 'New' check (status in (
    'New', 'Contacted', 'Consultation booked', 'Viewing booked', 'Viewed', 'Booking', 'SPA',
    'Closed - purchased', 'Closed - not proceeding', 'On hold'
  )),
  journey_stage text not null default 'Discover',
  lead_category text not null default 'Unclassified',
  next_action text,
  next_follow_up_date date,
  last_contact_date date,
  notes text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;
-- Intentionally no policies: anon/authenticated cannot read or write the table directly.
revoke all on public.leads from anon, authenticated;

-- Insert-only entry point. Accepts only buyer-facing fields; CRM fields always take defaults.
-- Returns the generated lead code. Does not expose any existing data.
create or replace function public.submit_lead(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  code text := 'PC-' || to_char(now() at time zone 'Asia/Kuala_Lumpur', 'YYYYMMDD') || '-' ||
               upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
begin
  if coalesce((payload->>'consent_given')::boolean, false) is not true then
    raise exception 'consent required' using errcode = '22023';
  end if;

  insert into public.leads (
    lead_code, full_name, phone, email, preferred_contact, intent,
    project_slug, project_name, unit_type_id, unit_type_name,
    preferred_viewing_date, preferred_viewing_time, message,
    dream_desire, dream_readiness, dream_eligibility, dream_affordability, dream_match,
    consent_given, consent_text, consent_version,
    cta_source, utm_source, utm_medium, utm_campaign
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
    left(nullif(payload->>'utm_campaign', ''), 100)
  );
  return code;
end;
$$;

-- Supabase default privileges grant EXECUTE on new public functions to anon and authenticated,
-- so revoke from authenticated explicitly as well as from public.
revoke all on function public.submit_lead(jsonb) from public;
revoke all on function public.submit_lead(jsonb) from authenticated;
-- anon only: the Next.js server calls this with the publishable key (kept server-side).
-- The Supabase advisor flags this as a WARN; it is intentional — the function is insert-only.
grant execute on function public.submit_lead(jsonb) to anon, service_role;
