# AIM StudioOS Docs

This directory is the reconciled implementation contract for AIM StudioOS V1.

It is authoritative only when it stays aligned with:

- product scope in [studio_os_prd.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/studio_os_prd.md:1)
- backend truth in [20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)
- live frontend routes in [app/](/Users/doddy/Desktop/Github/studioos_vscode_april22/app:1)
- implemented query and auth contracts in [lib/supabase/](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase:1) and [lib/studio-data.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:1)

## Current Product State

The repo is now route-complete and integration-capable for the implemented V1 scope.

- authenticated and unauthenticated navigation paths exist
- workspace routes are present for all current V1 surfaces
- page loaders are query-backed and auth-aware
- missing-documents remains intentionally non-live

The repo structure and deployed auth flow are now aligned enough for authenticated routes to render.

The next practical blocker is hosted seed data population so the live app can be reviewed meaningfully.

## Deployment State

The repo and the deployed environment are not currently equivalent.

- repo truth expects the `public` schema objects from the current migration to be available
- the hosted Supabase project now has the repo migration applied
- authenticated routes are rendering against the hosted environment
- the live hosted dataset is still awaiting seed population
- this is a deployment and integration issue, not a product-model or scope change

## Authority Map

| File | Authority |
|---|---|
| [studio_os_prd.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/studio_os_prd.md:1) | product scope intent and V1 boundaries |
| [supabase/migrations/20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1) | current backend schema, views, constraints, triggers, and live attention derivation |
| [lib/supabase/view-contracts.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/view-contracts.ts:1) | TypeScript row contracts for the implemented SQL views and joined records |
| [lib/supabase/queries.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/queries.ts:1) | current server-side query composition and fallback behavior |
| [lib/supabase/auth.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/supabase/auth.ts:1) | current auth-aware workspace gating behavior |
| [lib/studio-data.ts](/Users/doddy/Desktop/Github/studioos_vscode_april22/lib/studio-data.ts:1) | current page-data adapters used by the frontend |
| [app/](/Users/doddy/Desktop/Github/studioos_vscode_april22/app:1) | current route inventory and rendered screen structure |
| [docs/architecture-v1.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/architecture-v1.md:1) | reconciled route map, screen inventory, module ownership, and dependency contract |
| [docs/controlled-vocabulary.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/controlled-vocabulary.md:1) | exact current vocabulary that matches backend reality and live routes |
| [docs/data-model.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/data-model.md:1) | human-readable reflection of the current migration |
| [docs/interface-contracts.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/interface-contracts.md:1) | per-screen handoff for frontend, backend, and QA |
| [docs/implementation-sequence.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/implementation-sequence.md:1) | current integration state and next sequencing |
| [docs/crud-v1.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/crud-v1.md:1) | V1 editable-record scope, route additions, form requirements, and mutation handoff |

## Precedence Rule

Use this order when documents disagree:

1. Implemented backend truth: SQL migration and current `lib/supabase/view-contracts.ts`
2. Implemented app truth: `app/`, `lib/supabase/queries.ts`, and `lib/supabase/auth.ts`
3. Product scope truth: `studio_os_prd.md`
4. Reconciled docs in `docs/`
5. Older root summaries such as `README.md` and `AGENT.md`

Rules:

- `docs/` must synthesize items 1 to 3 accurately
- `docs/` must not describe speculative routes, entities, statuses, or blockers as implemented truth
- if `docs/` drift again, SQL, query code, auth code, routes, and the PRD win

## Environment Truth Vs Repo Truth

Repo truth:

- `public.profiles` exists in [20260422_000001_initial_foundation.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/migrations/20260422_000001_initial_foundation.sql:1)
- the repo’s auth-aware contract expects authenticated workspace routes to render
- the repo includes seed data at [supabase/seed.sql](/Users/doddy/Desktop/Github/studioos_vscode_april22/supabase/seed.sql:1)

Hosted truth:

- the hosted schema drift has been resolved by applying the repo migration
- authenticated routes are now rendering in the hosted environment
- the remaining gap is that the live hosted dataset has not yet been populated with meaningful seed records

Interpretation:

- this is a deployment and integration issue
- this is not a product-model change
- this is not a reason to redesign routes, modules, or V1 scope

## Release Readiness Checklist

- hosted project has the current migration applied
- authenticated workspace routes render successfully
- authenticated `profiles` lookup passes in the hosted environment
- hosted seed data is populated
- Playwright authenticated smoke test passes against the deployed environment

## Read In This Order

1. [architecture-v1.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/architecture-v1.md:1)
2. [backend-foundation.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/backend-foundation.md:1)
3. [controlled-vocabulary.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/controlled-vocabulary.md:1)
4. [data-model.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/data-model.md:1)
5. [interface-contracts.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/interface-contracts.md:1)
6. [implementation-sequence.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/implementation-sequence.md:1)
7. [crud-v1.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/crud-v1.md:1)

## Non-Authoritative Files

- [build-log.md](/Users/doddy/Desktop/Github/studioos_vscode_april22/docs/build-log.md:1) is historical only
- root `README.md` and `AGENT.md` are summary files, not schema or route authority
