# HDA StudioOS Docs

This directory contains the reconciled implementation documentation for HDA StudioOS V1.

It is authoritative when aligned with:

- product scope in [`studio_os_prd.md`](../studio_os_prd.md)
- backend foundation in [`supabase/migrations/20260422_000001_initial_foundation.sql`](../supabase/migrations/20260422_000001_initial_foundation.sql)
- live frontend routes in [`app/`](../app)
- implemented query, validation, and auth contracts in [`lib/supabase/`](../lib/supabase) and [`lib/validation/`](../lib/validation)

## Current Implementation State

- **Source Code**: Navigation, CRUD forms, server actions, fail-closed auth gating, domain validation, and partial query preservation are implemented.
- **Verification**: `npm run typecheck`, `npm run lint`, `npm test` (54/54 unit tests passed across 9 test files), `npm run build`, and Playwright smoke tests (unauthenticated: 2 passed, 1 credential-blocked skip; authenticated: 3/3 passed when credentials supplied) are verified locally.
- **Database Migrations**: Foundation migration is defined. Pending release hardening migration [`supabase/migrations/20260423000004_release_hardening.sql`](../supabase/migrations/20260423000004_release_hardening.sql) is present in source, statically reviewed, but **NOT APPLIED** to hosted database.
- **Hosted Environment**: Pending migrations remain unapplied. Hosted seed data population and authenticated E2E verification were separately verified.

## Authority Map

| File | Authority |
|---|---|
| [`studio_os_prd.md`](../studio_os_prd.md) | product scope intent and V1 boundaries |
| [`supabase/migrations/20260422_000001_initial_foundation.sql`](../supabase/migrations/20260422_000001_initial_foundation.sql) | current backend schema, views, constraints, triggers, and live attention derivation |
| [`lib/supabase/view-contracts.ts`](../lib/supabase/view-contracts.ts) | TypeScript row contracts for implemented SQL views and joined records |
| [`lib/supabase/queries.ts`](../lib/supabase/queries.ts) | current server-side query composition and partial data handling |
| [`lib/supabase/auth.ts`](../lib/supabase/auth.ts) | current auth-aware workspace gating behavior |
| [`lib/validation/domain-validation.ts`](../lib/validation/domain-validation.ts) | production domain validation rules |
| [`lib/studio-data.ts`](../lib/studio-data.ts) | current page-data adapters used by the frontend |
| [`app/`](../app) | current route inventory and rendered screen structure |
| [`docs/architecture-v1.md`](./architecture-v1.md) | reconciled route map, screen inventory, module ownership, and dependency contract |
| [`docs/controlled-vocabulary.md`](./controlled-vocabulary.md) | exact current vocabulary that matches backend reality and live routes |
| [`docs/data-model.md`](./data-model.md) | human-readable reflection of the current database foundation |
| [`docs/interface-contracts.md`](./interface-contracts.md) | per-screen handoff for frontend, backend, and QA |
| [`docs/implementation-sequence.md`](./implementation-sequence.md) | current integration state and next sequencing |
| [`docs/crud-v1.md`](./crud-v1.md) | V1 editable-record scope, route additions, form requirements, and mutation handoff |

## Precedence Rule

Use this order when documents disagree:

1. Implemented backend truth: SQL migrations and `lib/supabase/view-contracts.ts`
2. Implemented app truth: `app/`, `lib/supabase/queries.ts`, `lib/validation/`, and `lib/supabase/auth.ts`
3. Product scope truth: `studio_os_prd.md`
4. Reconciled docs in `docs/`
