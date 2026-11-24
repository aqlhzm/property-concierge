-- Property Concierge: automatic timeline (Phase 2, steps 3 and 4)
--
-- * Every change to status, priority, follow-up, assignment, archive state or contact details writes a
--   timeline entry with who made it. Done in the database so the audit trail cannot be skipped.
-- * Logging a call, WhatsApp, email, meeting or viewing stamps last_contacted_at and moves a New lead
--   to Contacted (which is itself recorded as a status change).

alter table public.lead_activities drop constraint if exists lead_activities_type_check;
alter table public.lead_activities add constraint lead_activities_type_check check (type in (
  'note', 'call', 'whatsapp', 'email', 'meeting', 'viewing',
  'status_change', 'priority_change', 'follow_up_set', 'assigned', 'created',
  'archived', 'restored', 'details_changed'
));

create or replace function public.leads_after_update()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_staff uuid := auth.uid();
  v_changed jsonb := '{}'::jsonb;
begin
  if v_staff is not null and not exists (select 1 from public.staff where user_id = v_staff) then
    v_staff := null;
  end if;

  if new.status is distinct from old.status then
    insert into public.lead_activities (lead_id, staff_id, type, meta)
    values (new.id, v_staff, 'status_change', jsonb_build_object('from', old.status, 'to', new.status));
  end if;

  if new.priority is distinct from old.priority then
    insert into public.lead_activities (lead_id, staff_id, type, meta)
    values (new.id, v_staff, 'priority_change', jsonb_build_object('from', old.priority, 'to', new.priority));
  end if;

  if new.next_follow_up_at is distinct from old.next_follow_up_at or new.next_action is distinct from old.next_action then
    insert into public.lead_activities (lead_id, staff_id, type, meta)
    values (new.id, v_staff, 'follow_up_set', jsonb_build_object(
      'at', new.next_follow_up_at, 'action', new.next_action,
      'previous_at', old.next_follow_up_at, 'previous_action', old.next_action));
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.lead_activities (lead_id, staff_id, type, meta)
    values (new.id, v_staff, 'assigned', jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;

  if old.archived_at is null and new.archived_at is not null then
    insert into public.lead_activities (lead_id, staff_id, type) values (new.id, v_staff, 'archived');
  elsif old.archived_at is not null and new.archived_at is null then
    insert into public.lead_activities (lead_id, staff_id, type) values (new.id, v_staff, 'restored');
  end if;

  if new.full_name is distinct from old.full_name then v_changed := v_changed || jsonb_build_object('full_name', old.full_name); end if;
  if new.phone is distinct from old.phone then v_changed := v_changed || jsonb_build_object('phone', old.phone); end if;
  if new.email is distinct from old.email then v_changed := v_changed || jsonb_build_object('email', old.email); end if;
  if new.preferred_contact is distinct from old.preferred_contact then
    v_changed := v_changed || jsonb_build_object('preferred_contact', old.preferred_contact);
  end if;
  if v_changed <> '{}'::jsonb then
    insert into public.lead_activities (lead_id, staff_id, type, meta)
    values (new.id, v_staff, 'details_changed', jsonb_build_object('previous', v_changed));
  end if;

  return null;
end;
$$;
revoke all on function public.leads_after_update() from public, anon, authenticated;
drop trigger if exists leads_after_update on public.leads;
create trigger leads_after_update after update on public.leads
  for each row execute function public.leads_after_update();

create or replace function public.lead_activity_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.type in ('call', 'whatsapp', 'email', 'meeting', 'viewing') then
    update public.leads
       set last_contacted_at = greatest(coalesce(last_contacted_at, new.created_at), new.created_at),
           status = case when status = 'new' then 'contacted' else status end
     where id = new.lead_id;
  end if;
  return null;
end;
$$;
revoke all on function public.lead_activity_after_insert() from public, anon, authenticated;
drop trigger if exists lead_activity_after_insert on public.lead_activities;
create trigger lead_activity_after_insert after insert on public.lead_activities
  for each row execute function public.lead_activity_after_insert();

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status) where archived_at is null;
