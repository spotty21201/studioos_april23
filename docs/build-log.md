# Build Log

This file is historical only. It is not an authority over:

- `studio_os_prd.md`
- the active migration
- the live route structure
- the reconciled docs contract in `docs/`

## 2026-04-22

Added the backend foundation for AIM StudioOS V1.

Files:

- [supabase/migrations/20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql)
- [supabase/seed.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/seed.sql)
- [docs/backend-foundation.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/backend-foundation.md)

Key decisions:

- kept finance operational and summary-oriented, not ledger-based
- modeled alerts as derived SQL views instead of mutable alert tables
- supported both uploaded documents and external links in one documents table
- kept the current foundation migration focused on normalized tables, check-constrained status fields, and overview views
- left more advanced auth, RLS, storage-bucket, and traceability automation as later follow-on work

Follow-up patch:

- aligned `docs/data-model.md`, `docs/interface-contracts.md`, and `docs/backend-foundation.md` to the actual current migration
- replaced speculative screen contracts with exact SQL view contracts in [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1)
- enforced project/contact integrity so `primary_contact_id` cannot point across clients
