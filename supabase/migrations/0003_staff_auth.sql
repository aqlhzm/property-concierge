-- Property Concierge: staff sign-in (Phase 2, step 2)
--
-- * staff_invites: the allowlist. An invited email becomes a staff row the first time it signs in.
-- * is_staff(): the single check every policy uses.
-- * Policies: signed-in staff may read leads and the timeline, update CRM fields and add timeline entries.
--   Nobody may delete a lead or edit / delete a timeline entry through the API.
-- * Sign-ups: a trigger on auth.users refuses any email that is not invited or already staff,
--   so the public cannot create accounts even by calling the Auth API directly.

------------------------------------------------------------------------------
-- Allowlist
------------------------------------------------------------------------------
create table if not exists public.staff_invites (
  email text primary key check (email = lower(btrim(email)) and email like '%_@_%'),
  full_name text not null,
  role text not null default 'agent' check (role in ('owner', 'agent')),
  created_at timestamptz not null default now()
);
alter table public.staff_invites enable row level security;
revoke all on public.staff_invites from anon, authenticated;

insert into public.staff_invites (email, full_name, role)
values ('aqlhzm96@gmail.com', 'Aqil', 'owner')
on conflict (email) do nothing;

------------------------------------------------------------------------------
-- Helpers
------------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and active);
$$;
revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

-- Used by the server before it sends a code, so codes only go to invited or active staff.
create or replace function public.staff_login_allowed(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.staff_invites where email = lower(btrim(p_email)))
      or exists (select 1 from public.staff where email = lower(btrim(p_email)) and active);
$$;
revoke all on function public.staff_login_allowed(text) from public, authenticated;
grant execute on function public.staff_login_allowed(text) to anon;

-- Called right after a code is verified. Turns an invite into a staff row and returns the role,
-- or null when this account has no access.
create or replace function public.claim_staff()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(btrim(coalesce(auth.jwt() ->> 'email', '')));
  v_role text;
begin
  if v_uid is null or v_email = '' then
    return null;
  end if;

  select case when active then role end into v_role from public.staff where user_id = v_uid;
  if found then
    return v_role;
  end if;

  insert into public.staff (user_id, email, full_name, role)
  select v_uid, i.email, i.full_name, i.role from public.staff_invites i where i.email = v_email
  on conflict do nothing
  returning role into v_role;

  if v_role is not null then
    delete from public.staff_invites where email = v_email;
  end if;
  return v_role;
end;
$$;
revoke all on function public.claim_staff() from public, anon;
grant execute on function public.claim_staff() to authenticated;

------------------------------------------------------------------------------
-- Block sign-ups from anyone who is not invited
------------------------------------------------------------------------------
create or replace function public.guard_auth_signup()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.email is null or not (
       exists (select 1 from public.staff_invites where email = lower(btrim(new.email)))
    or exists (select 1 from public.staff where email = lower(btrim(new.email)))
  ) then
    raise exception 'sign-ups are by invitation only' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function public.guard_auth_signup() from public, anon, authenticated;

drop trigger if exists guard_auth_signup on auth.users;
create trigger guard_auth_signup before insert on auth.users
  for each row execute function public.guard_auth_signup();

------------------------------------------------------------------------------
-- Grants and policies for signed-in staff
------------------------------------------------------------------------------
grant select on public.staff to authenticated;
drop policy if exists staff_read on public.staff;
create policy staff_read on public.staff for select to authenticated using (public.is_staff());

grant select on public.leads to authenticated;
grant update (
  full_name, phone, email, preferred_contact,
  status, priority, assigned_to, next_action, next_follow_up_at, last_contacted_at, archived_at
) on public.leads to authenticated;
drop policy if exists leads_staff_read on public.leads;
create policy leads_staff_read on public.leads for select to authenticated using (public.is_staff());
drop policy if exists leads_staff_update on public.leads;
create policy leads_staff_update on public.leads for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

grant select, insert on public.lead_activities to authenticated;
drop policy if exists activities_staff_read on public.lead_activities;
create policy activities_staff_read on public.lead_activities for select to authenticated using (public.is_staff());
drop policy if exists activities_staff_insert on public.lead_activities;
create policy activities_staff_insert on public.lead_activities for insert to authenticated
  with check (public.is_staff() and staff_id = auth.uid() and type <> 'created');
