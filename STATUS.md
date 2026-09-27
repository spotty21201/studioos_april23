# Studio OS → Nabire Migration Status

**Status date:** 2026-09-27 (Asia/Jakarta)  
**Mission mode:** parallel discovery and development; production remains unchanged.

## Executive status

- A dedicated branch, `migration/nabire-parallel`, was created from `main`. The canonical repository remains GitHub.
- The branch is checked out on Nabire at `/home/spotty/projects/studioos`; locked dependencies install, build, type-check, lint, and pass the unit suite there.
- Production has **not** been changed; no production data has been exported or copied.
- Vercel project discovery succeeded, but project/deployment details require re-authentication to the Vercel team scope.
- The candidate production deployment redirects anonymous requests to Vercel SSO. Authenticated current-vs-new workflow testing is therefore blocked.

## Verified access and source baseline

| System | Result |
|---|---|
| GitHub | Access confirmed. Repository: [spotty21201/studioos_april23](https://github.com/spotty21201/studioos_april23), public, owner `spotty21201`, default branch `main`; connector reports admin/maintain/push access. |
| Branches | Before this migration branch was created, `main` and `agent/hda-studioos-release-hardening` were present. `migration/nabire-parallel` now branches from `main`. |
| Starting revision | `aa7276c364d2cd55e783fd8dd28dfa03cc562540` — “docs: add design specs, QA reports, build-log and backlog for export/UI/whitespace round”, 2026-08-27. |
| Vercel | Project list contains `studioos` (`prj_QdomYwmEBchicA5GNuUyFywtl80K`). Project/deployment API calls return 403: re-authentication is required for team scope `spotty21201s-projects`. Current deployment SHA, Git link, domains, build settings and environment-variable names are unverified. No values were requested or recorded. |
| Production reachability | A candidate project deployment hostname redirected to Vercel SSO before the application; it did not expose the app or user data. This does not establish that the current production deployment is healthy. |
| Supabase | No direct dashboard/database connector is available in this session. Source and migration audit completed from GitHub checkout; project health, hosted schema state, users, records, and storage contents remain unverified. |
| Nabire | This execution host identifies as `nabire` (Ubuntu 24.04.5 LTS); Tailscale is active. The branch is cloned in `/home/spotty/projects/studioos`. Direct SSH to the local hostname fails host-key verification, so no SSH host key was accepted. |

## Application baseline

- **Stack:** Next.js 16.2.11 App Router, React 19.2.4, TypeScript, Tailwind 4, npm lockfile, Vitest, Playwright; Next production build uses Turbopack.
- **Runtime/data:** server-rendered workspace routes, Server Actions, Supabase SSR server client and PostgREST query layer. Missing Supabase configuration intentionally renders isolated fallback records in development. Fallback records are not a production-data copy.
- **Auth:** Supabase Auth session via `auth.getUser()`, cookie-backed SSR, and `profiles` lookup. Workspace access checks active profiles. User roles exist; policies currently center on active-user access rather than a complete role-permission UI.
- **Routes in the checked-out code:** login, dashboard, projects/list/detail/create/edit, finance/invoice and vendor-obligation flows, and settings; export/archive API routes. Product docs also describe Documents and Notes/Activity, but these page routes are absent from this checkout and a repository backlog records them as deferred.
- **External services:** Supabase Postgres/Auth and Vercel hosting are explicit dependencies. No runtime reference to Supabase Storage SDK, Realtime channels, Edge Functions, or `functions.invoke` was found in the checked source. Document rows support a file path or external URL; the current form accepts a path string and does not implement file upload.
- **Testing/config:** `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`. Required runtime config names found in code are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; no values are included here.

## Supabase dependency matrix

| Capability | Where used | Importance | Nabire direction | Migration risk |
|---|---|---:|---|---|
| PostgreSQL tables and relations | 11 core tables: profiles, studio profile, clients/contacts, projects, vendors, invoices, vendor obligations, documents, notes, activity events | Critical | Start with local PostgreSQL for behavioral parity; consider SQLite only after query/transaction compatibility is proven | High: UUID/FK integrity, numeric/timestamp semantics, JSONB, seeded IDs |
| Views, SQL functions, triggers | Six summary/attention views; updated-at and client-contact integrity triggers; transactional create/update/note RPCs | Critical | Port logic into reviewed SQL migrations or server data layer; preserve transaction boundaries and calculations | High |
| Auth | Supabase Auth users, SSR cookie/session reads, profiles and sign-in/out | Critical | Private-network-only local auth/session implementation with explicit user/role mapping; choose after Nabire security review | High: account identity, session security, recovery, existing UUID references |
| RLS and policies | Policies in migrations gate records to active authenticated profiles; note delete policy added in August | Critical | Enforce authorization in server layer and test every operation before removing RLS dependency | High |
| Storage | Document metadata accepts `file_path` or `external_url`; no active storage SDK call or bucket migration was found | Medium | Structured Nabire filesystem plus authenticated download API if file upload/storage is confirmed as required | Medium; actual hosted objects still unknown |
| PostgREST API | Supabase client queries tables/views, nested relations and invokes three RPCs | Critical | Next server data/API layer over the selected local database | High: joins, sorting, empty/error semantics |
| Realtime / Edge Functions | No runtime usage found in inspected code/migrations | None observed | No replacement unless further audit finds a dependency | Low |

**Initial architecture judgment:** do not start with a SQLite conversion. Local PostgreSQL is the lowest-risk reproduction target because the current application relies on PostgreSQL views, JSONB, RLS, triggers, and transactional RPCs. Reassess SQLite after the app has a database-independent server data layer and real production query patterns are understood.

## Tests and production-vs-local baseline

- On Nabire, `npm ci` passed (474 packages); npm reported 11 dependency advisories (1 low, 3 moderate, 6 high, 1 critical). No automatic audit fix was applied.
- Unit tests: **173 passed / 26 files**.
- ESLint: passed.
- TypeScript: passed.
- Production build: passed; Next enumerated the implemented routes.
- Production-mode loopback smoke check: `GET /login` returned 200; signed-out `GET /dashboard` returned 307 to `/login`. The server listened only on `127.0.0.1:3101` and was stopped after the check.
- E2E: **7 of 18 passed** (CSV/XLSX export and archive API checks). The other 11 could not launch Chromium because this host lacks browser shared libraries, including `libatk-1.0.so.0`; installing the Playwright browser alone did not resolve that. `agent-browser` hit the same missing-library issue. No browser-driven UI result is claimed.
- A private dev server on `127.0.0.1:3101` started successfully and was stopped after the browser launch attempt. Port 3100 is used by another local service and was left untouched.
- Current user-test session: the dev server is bound to Nabire's Tailscale interface on port `3111`; `GET /dashboard` returns 200. It runs in read-only preview mode with fallback records, has no Supabase authentication or production data, and is not routed through Funnel.
- Tailscale Funnel is enabled and proxies a separate localhost service on port 3100. Studio OS was not exposed through this route; review the existing Funnel route's intended security/access policy before relying on it.
- Production: anonymous request was redirected to Vercel SSO, so no authenticated screen, data, persistence, or CRUD behavior was observed in this run.
- Prior repo QA (2026-08-19 and 2026-08-27) records authenticated workflows, finance/export behavior and outstanding product gaps. It is historical evidence, not a fresh production comparison.

## Feedback located in repository materials

| Classification | Feedback/evidence | Status |
|---|---|---|
| Bug / workflow improvement | Mira and Bu Indri QA surfaced project-finance visibility, fuller invoice register, responsibility labels/data, finance reconciliation, export formatting and navigation refinements | Prior implementation and unit coverage are recorded; fresh production regression test remains blocked |
| Missing capability | Ibu Indri requested fuller XLS reporting and Project Owner/Lead visibility | Export and responsibility fields are implemented; authenticated production review still pending |
| Workflow improvement | Project setup should support multiple invoice terms and total-percent validation | Deferred; needs explicit terms and business rules |
| Missing capability | Durable invoice status history and automatic overdue transition | Deferred |
| Friction | Client short names/legal entities/aliases and duplicate resolution | Deferred |
| Missing capability | Archived-project listing and permission-governed restore; draft autosave | Recorded in prior QA/backlog; verify current checkout before dispatch |
| Visual/UX refinement | Calm interface, easier route discoverability, finance clarity and export readability | Prior UI/QA docs exist; no new design changes made in this migration pass |

Sources: `docs/mira-indri-qa-2026-08-19.md`, `docs/qa/2026-08-27-tester-*.md`, `docs/backlog-export-and-routes-2026-08-27.md`, and `docs/design/`.

## Actions and recovery

- Production branch `main`, Vercel production, and Supabase hosted services have not been changed.
- The development branch is `migration/nabire-parallel`, at `518c5452c8fdfc1dd03b68c678d03fa5a08458a9` before this status update. The working tree was clean after the local verification run.
- The only changes made on Nabire were cloning the public branch, installing its locked npm dependencies, downloading Playwright browser files into the user cache, and starting/stopping a loopback-only dev server. No OS packages, services, credentials, or production data were changed.
- No `psql` client or active PostgreSQL service was found; no Studio OS system service is configured. Nabire backup/restore readiness remains unverified.
- No data has been migrated. Do not use demo seed data as a substitute for production export.
- Development baseline is reproducible from GitHub branch `migration/nabire-parallel`; return to the starting point at `aa7276c364d2cd55e783fd8dd28dfa03cc562540`.
- No production cutover, DNS change, paid infrastructure, or destructive operation has occurred.

## Smallest remaining human actions

1. Reauthorize the Vercel connector for the existing `spotty21201s-projects` team scope (or provide an already-connected authorized project scope). A direct project query returned 403; no secrets need to be sent in chat.
2. Enable read-only Supabase project access or a secure authorized export path before hosted data/schema validation. The source database must remain unchanged.
3. For browser UI testing on Nabire, provide a path to install Chromium's missing OS libraries or run the browser suite in an environment that already has them.
4. Provide an authorized ordinary-user production session for current-vs-development browser testing; the existing candidate deployment is behind Vercel SSO.

## Next safe steps

1. Resolve the browser runtime libraries so authenticated/unauthenticated UI regression checks can run locally.
2. Reauthorize Vercel and obtain read-only Supabase access; inspect live deployments/schema before designing data migration.
3. Inspect Nabire service supervision, backup/restore, firewall and remote administration posture. No Studio OS persistent service or local database has been configured.
4. Build the first Nabire backend migration only after production schema/data inventory; keep it reversible and retain Vercel/Supabase until owner acceptance.
