-- Enable deleting project notes.
--
-- Two separate things are required, and the first was missing:
--   1. A table-level GRANT so the `authenticated` role may run DELETE at all.
--      20260423000002_safe_v1_writes.sql granted only SELECT/INSERT/UPDATE on
--      public.notes, so DELETE failed with Postgres 42501
--      ("permission denied for table notes") before any row policy was checked.
--   2. A row-level DELETE policy so active authenticated users may delete rows.
--      Notes already have SELECT/INSERT/UPDATE policies but no DELETE policy.
--
-- Idempotent: safe to re-run.

grant delete on table public.notes to authenticated;

drop policy if exists notes_delete_active_users on public.notes;
create policy notes_delete_active_users
on public.notes
for delete
to authenticated
using (public.current_user_is_active());
