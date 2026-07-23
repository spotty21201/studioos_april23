# Build Log

This file is historical only. It is not an authority over:

- `studio_os_prd.md`
- active migrations
- live route structure
- reconciled docs contract in `docs/`

## 2026-07-23 (V1 Corrective Release-Hardening Pass)

Completed a corrective release-hardening pass covering production domain validation extraction, auth/authorization state testing, recoverable sign-out error handling, partial domain query data preservation testing, migration safety hardening, and dependency vulnerability resolution.

Files modified/added:
- [`lib/validation/domain-validation.ts`](../lib/validation/domain-validation.ts): Created production domain validation module.
- [`lib/supabase/auth-evaluator.ts`](../lib/supabase/auth-evaluator.ts): Extracted pure workspace authorization evaluator (`is_active` active profile checking).
- [`lib/auth/sign-out-handler.ts`](../lib/auth/sign-out-handler.ts): Extracted sign-out error handling logic.
- [`lib/supabase/query-processor.ts`](../lib/supabase/query-processor.ts): Extracted pure domain query processing and partial data preservation logic.
- [`components/auth/sign-out-button.tsx`](../components/auth/sign-out-button.tsx): Updated to present recoverable error alerts on sign-out failure.
- [`app/(workspace)/actions.ts`](../app/(workspace)/actions.ts): Integrated production domain validation and Server Action row verification.
- [`supabase/migrations/20260423000004_release_hardening.sql`](../supabase/migrations/20260423000004_release_hardening.sql): Hardened pending migration with table-scoped constraint checks, explicit `search_path`, strict project existence check, and preflight SQL queries.
- [`tests/unit/validation.test.ts`](../tests/unit/validation.test.ts), [`tests/unit/auth.test.ts`](../tests/unit/auth.test.ts), [`tests/unit/sign-out.test.ts`](../tests/unit/sign-out.test.ts), [`tests/unit/queries.test.ts`](../tests/unit/queries.test.ts), [`tests/unit/env.test.ts`](../tests/unit/env.test.ts): Implemented 28 production-code unit tests.
- [`tests/e2e/smoke.spec.ts`](../tests/e2e/smoke.spec.ts): Updated Playwright smoke suite (2 passed, 1 skipped due to missing credentials).

Status:
- Implemented in source and verified via static checks and Vitest unit suite.
- Playwright smoke suite passed 2 unauthenticated tests; 1 authenticated test skipped due to absent credentials.
- Migration `20260423000004_release_hardening.sql` is present in source, statically reviewed, but **NOT APPLIED** to hosted database.

## 2026-04-22

Added the backend foundation for HDA StudioOS V1.

Files:

- [`supabase/migrations/20260422_000001_initial_foundation.sql`](../supabase/migrations/20260422_000001_initial_foundation.sql)
- [`supabase/seed.sql`](../supabase/seed.sql)
- [`docs/backend-foundation.md`](./backend-foundation.md)

Key decisions:

- kept finance operational and summary-oriented, not ledger-based
- modeled alerts as derived SQL views instead of mutable alert tables
- supported both uploaded documents and external links in one documents table
- kept foundation migration focused on normalized tables, check-constrained status fields, and overview views
- left advanced auth, RLS, storage-bucket, and traceability automation as later follow-on work
