-- Remove obsolete QA client records without touching clients used by projects or invoices.
-- The dependency guards keep this migration safe if any record is reused before it runs.

delete from public.clients as client
where client.id = any (
  array[
    '30000000-0000-4000-8000-000000000001', -- Lippo Group (legacy seed duplicate)
    '30000000-0000-4000-8000-000000000002', -- KLH Group
    '30000000-0000-4000-8000-000000000004', -- Apex Advisory
    '6941a42d-667b-4983-8fff-36d1e3a94dfc', -- Paramount Serpong
    'b402f102-f164-47f5-9a57-6b096002df94'  -- YPT TELKOM
  ]::uuid[]
)
and not exists (
  select 1
  from public.projects as project
  where project.client_id = client.id
)
and not exists (
  select 1
  from public.invoices as invoice
  where invoice.client_id = client.id
);
