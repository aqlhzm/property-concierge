-- Phase 2 step 8: clear the Supabase advisor findings.
-- * One of two identical created_at indexes on leads is dropped.
-- * RLS policies call auth.uid() and is_staff() once per statement (wrapped in a subselect), not once per row.
-- * Foreign keys used for joins get covering indexes.
-- Behaviour is unchanged: the same rows are visible and writable to the same people.

drop index if exists public.leads_created_at_idx; -- identical to leads_created_idx

drop policy if exists activities_staff_insert on public.lead_activities;
create policy activities_staff_insert on public.lead_activities
  for insert to authenticated
  with check ((select public.is_staff()) and staff_id = (select auth.uid()) and type <> 'created');

drop policy if exists activities_staff_read on public.lead_activities;
create policy activities_staff_read on public.lead_activities
  for select to authenticated
  using ((select public.is_staff()));

drop policy if exists leads_staff_read on public.leads;
create policy leads_staff_read on public.leads
  for select to authenticated
  using ((select public.is_staff()));

drop policy if exists leads_staff_update on public.leads;
create policy leads_staff_update on public.leads
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists staff_read on public.staff;
create policy staff_read on public.staff
  for select to authenticated
  using ((select public.is_staff()));

create index if not exists lead_activities_staff_idx on public.lead_activities (staff_id);
create index if not exists leads_assigned_to_idx on public.leads (assigned_to);
