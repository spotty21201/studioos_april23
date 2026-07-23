# HDA StudioOS V1 Implementation Sequence

This document provides the canonical sequencing and status tracking for HDA StudioOS V1 implementation.

## Status Categorization

### 1. Implemented in Source Code
- Frontend route structure under [`app/`](../app)
- Page adapters and viewer wrappers in [`lib/studio-data.ts`](../lib/studio-data.ts)
- Query composition and partial-domain error handling in [`lib/supabase/queries.ts`](../lib/supabase/queries.ts) and [`lib/supabase/query-processor.ts`](../lib/supabase/query-processor.ts)
- Fail-closed workspace access control and active profile authorization (`is_active = true`) in [`lib/supabase/auth.ts`](../lib/supabase/auth.ts) and [`lib/supabase/auth-evaluator.ts`](../lib/supabase/auth-evaluator.ts)
- Production domain validation logic in [`lib/validation/domain-validation.ts`](../lib/validation/domain-validation.ts)
- Server Actions for V1 CRUD mutations in [`app/(workspace)/actions.ts`](../app/(workspace)/actions.ts)
- Recoverable sign-out state handling in [`components/auth/sign-out-button.tsx`](../components/auth/sign-out-button.tsx) and [`lib/auth/sign-out-handler.ts`](../lib/auth/sign-out-handler.ts)
- Environment mode classification (`configured_live`, `allowed_local_preview`, `production_config_error`) in [`lib/supabase/env.ts`](../lib/supabase/env.ts)

### 2. Statically Verified
- TypeScript compilation: `npm run typecheck` (0 errors)
- Code style & linting: `npm run lint` (0 errors/warnings)
- Production build compilation: `npm run build` (Turbopack static & dynamic pages successfully generated)
- Git formatting compliance: `git diff --check` (0 whitespace errors)

### 3. Locally Browser & Unit Tested
- Vitest unit test suite (`npm test`): 39/39 tests passed covering environment mode parsing, production domain validation rules, auth authorization state evaluation, sign-out error handling, and query processor partial data preservation.
- Playwright E2E smoke suite (`npm run test:e2e`): Unauthenticated E2E: 2 passed, 1 credential-blocked skip. Authenticated E2E: 3/3 passed when test user credentials were supplied.

### 4. Pending Database Application
- Release hardening database migration [`supabase/migrations/20260423000004_release_hardening.sql`](../supabase/migrations/20260423000004_release_hardening.sql) is present in source and statically reviewed, but **HAS NOT BEEN APPLIED** (pending migrations remain unapplied).
- Read-only preflight SQL queries are documented inside the migration file to check existing target rows before future application.

### 5. Credential-Blocked Verification
- Authenticated Playwright E2E test (`tests/e2e/smoke.spec.ts`) runs conditionally when `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` environment variables are supplied (verified 3/3 passed during provisioned test account verification).
- Hosted Supabase seed data population (`supabase/seed.sql`) is maintained in source.

## Verification Commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
```
