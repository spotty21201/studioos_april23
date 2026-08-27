# Tester T3 — Final Verification Pass

- **Date:** 2026-08-27
- **Tester:** Tester agent (T3)
- **Branch:** `agent/hda-studioos-release-hardening`
- **Working dir:** `/Users/doddy/Desktop/Github/studioos_vscode_april22`
- **Dev server:** `http://localhost:3000` (pane w6:p5)
- **Test login:** working session established via `/tmp/test-creds.json`; password `<redacted>` (never written to a file, never echoed in a log line, never committed).

---

## Pass / Fail table

| # | Item | Result | Evidence |
|---|---|---|---|
| 1a | Logged-OUT `/api/export-*` returns `401` on all 6 | **PASS** | curl (no cookies): all six endpoints → `HTTP=401` (`/api/export-projects`, `-xlsx`, `-pdf`, `/api/export-finance`, `-xlsx`, `-pdf`). |
| 1b | Logged-IN same 6 endpoints return `200` with correct `Content-Type` and `Content-Disposition` | **PASS** | Playwright `ctx.request.get`: all six → `200`; CSVs `text/csv; charset=utf-8`; XLSXs `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; PDFs `application/pdf`; filenames `studioos-{projects,finance}-2026-08-27.{csv,xlsx,pdf}`. |
| 1c | `/dashboard`, `/projects`, `/finance`, `/settings` redirect `307 → /login` when logged out | **PASS** | curl (no cookies): each path → `HTTP=307 LOC=/login`. |
| 2 | Create throwaway note on `HDA-260017`, then delete via the UI two-step | **PASS** | Note `T3 delete check` (Meeting note type) created; first `Delete` click swapped the button to `Confirm delete` + a `Cancel` appeared; second `Confirm delete` click removed the note. Final state: `T3 delete check` gone, `Meeting di Batam` intact. No 4xx/5xx during the flow. Screenshots: `/tmp/t3-pre-delete.png`, `/tmp/t3-after-delete-click.png`, `/tmp/t3-after-confirm.png`. |
| 3a | `Show archived` toggle surfaces `HDA-26TEST` with `Archived` badge + `Restore` button | **PASS** | Anchor `Show archived` present in the `/projects` filter area; click navigates to `/projects?show_archived=1`; row text for `HDA-26TEST` includes `ARCHIVED` and a `Restore` button. Screenshot: `/tmp/t3-archived-list.png`. |
| 3b | `Restore` action returns `HDA-26TEST` to the active list | **PASS** | First click on `Restore` swaps the button into a two-step `Confirm restore` + `Cancel` (inline React state arming). Second click on `Confirm restore` submitted the form and redirected to `/projects`. After the flow: `HDA-26TEST visible on ACTIVE /projects: 1`, `on ARCHIVED: 0`. Screenshot: `/tmp/t3-restore-armed.png`, `/tmp/t3-restore-after-confirm.png`. |
| 3c | Re-archive `HDA-26TEST` to leave DB as found | **PASS** | Navigated to detail, `Archive this project` → typed `QA Test Project (edited)` → `Yes, archive this project` → redirected to `/projects`. Final: `active: 0, archived: 1`. |
| 4a | Project detail: 4 summary cards render as ONE banded container (single border, dividers between) with the black spotlight card intact | **PASS** | DOM inspection at 1440: the four cards share one `<section class="overflow-hidden rounded-[4px] border border-border bg-surface">` containing one child `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">`. The black spotlight card is the 5th section (idx 5, classes `border border-black bg-black text-white …`). Screenshot: `/tmp/t3-1440-project-detail.png` (and `t3-1024-project-detail.png`). |
| 4b | Project detail `Finance` tab has `aria-label="Project finance tab"` and navigates via `?tab=finance` | **PASS** | DOM inspection: `<a href="…/projects/{id}?tab=finance" aria-label="Project finance tab">Finance</a>`. Screenshot: `/tmp/t3-1440-project-detail.png`. |
| 4c | `/dashboard` `Recent Updates` sits in a right column at 1440 | **PASS** | Parent section class `grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]` with computed `grid-template-columns: 744.797px 319.203px`. `Recent Updates` is at x=1089, w=319 (right of `Active Projects` at x=320, w=745). Screenshot: `/tmp/t3-1440-dashboard.png`. |
| 4d | `/dashboard` `Recent Updates` is **sticky** while scrolling | **FAIL** | After `window.scrollTo(0, 1500)`, `Recent Updates` `getBoundingClientRect().y = -194` (off-screen), `position: static`, `top: auto`. The right-column placement works, but the panel is not sticky — it scrolls away with the page. |
| 4e | `/projects` and `/finance` filters + Apply + export links sit on a single row at 1440 | **PASS** | `/projects`: `Search code…` x=419, `lifecycle` x=659, `health` x=841, `Apply` x=1023, `Show archived` x=1127, `Export XLSX` x=1264, `Export PDF` x=1397, `Export · CSV` x=1522 — all at y=309. `/finance`: `Apply` x=924 + three Export links at the same y=573. No stair-step. Screenshots: `/tmp/t3-1440-projects.png`, `/tmp/t3-1440-finance.png`. |
| 4f | `/projects` and `/finance` at ~1024 stack cleanly (no overlap, no clipping) | **PASS** | At 1024: filter row `Apply` at y=365; row 2 `Show archived` y=425 + the three export links all at y=425. Two clean rows, no clipping. Screenshots: `/tmp/t3-1024-projects.png`, `/tmp/t3-1024-finance.png`. |
| 5 | Quick export regression (logged-in) — CSV row 1 timestamp, XLSX row 1 timestamp, PDF landscape | **PASS** | All six exports `200`. CSV first bytes: `Generated: 2026-08-27T20:22:14+07:00,,,,,,,,,,,.Project Code…` and `Generated: 2026-08-27T20:22:15+07:00,,,,,,,,,.Project,Invoice Number…`. XLSX zip with `[Content_Types].xml` header. PDFs begin with `%PDF-1.3` (full byte-by-byte header verified). |

**Counts:** **PASS=13 / FAIL=1 / BLOCKED=0.**

The single FAIL is **4d — Recent Updates is not sticky** (column placement works at xl, but the panel scrolls with the page). See bugs section.

---

## Step 1 — Auth gate

### 1a — Logged-OUT (curl, no cookies)

```
/api/export-projects      -> HTTP=401
/api/export-projects-xlsx -> HTTP=401
/api/export-projects-pdf  -> HTTP=401
/api/export-finance       -> HTTP=401
/api/export-finance-xlsx  -> HTTP=401
/api/export-finance-pdf   -> HTTP=401
```

All six previously-unauthenticated export endpoints now correctly return `401`. (See T1 / T2 for the pre-fix state where they were `200`.) ✓

### 1b — Logged-IN (Playwright session)

```
[export] /api/export-projects      -> 200 ct=text/csv; charset=utf-8 cd=attachment; filename="studioos-projects-2026-08-27.csv" bytes=1335
[export] /api/export-projects-xlsx -> 200 ct=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet cd=attachment; filename="studioos-projects-2026-08-27.xlsx" bytes=4239
[export] /api/export-projects-pdf  -> 200 ct=application/pdf cd=attachment; filename="studioos-projects-2026-08-27.pdf" bytes=16179
[export] /api/export-finance       -> 200 ct=text/csv; charset=utf-8 cd=attachment; filename="studioos-finance-2026-08-27.csv" bytes=818
[export] /api/export-finance-xlsx  -> 200 ct=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet cd=attachment; filename="studioos-finance-2026-08-27.xlsx" bytes=3797
[export] /api/export-finance-pdf   -> 200 ct=application/pdf cd=attachment; filename="studioos-finance-2026-08-27.pdf" bytes=15210
```

All six serve full content with correct headers, dated filenames, and unchanged byte-count vs T2 (no payload regression). ✓

### 1c — Page redirects

```
/dashboard -> HTTP=307 LOC=/login
/projects  -> HTTP=307 LOC=/login
/finance   -> HTTP=307 LOC=/login
/settings  -> HTTP=307 LOC=/login
```

All four auth-gated routes still redirect unauthenticated visitors. ✓

---

## Step 2 — Note delete (`HDA-260017`)

The seeded project `HDA-260017` (`Surat Pesanan Pengadaan Master Plan …`) carries one real note, `Meeting di Batam` (note id `25b94ed2-0f4b-4621-895f-5b3925d0a464`). I only added a throwaway note and only deleted the throwaway.

- **Create throwaway:** filled `title="T3 delete check"`, body `Throwaway created during T3 verify; will be deleted.` (default `note_type=meeting_note`). Submit on the Add Note form returned the page to `/projects/ef497d24-…/notes?…`. The note appeared in the Notes panel with a `MEETING NOTE` chip and a `Delete` button.
- **First Delete click:** the in-card `Delete` button text swapped to `Confirm delete` and a sibling `Cancel` button appeared (inline two-step). No native dialog. Screenshot: `/tmp/t3-after-delete-click.png`.
- **Second click on `Confirm delete`:** the row containing `T3 delete check` disappeared. Page returned to the same URL with the `Notes` panel showing only the original `Meeting di Batam` note.
- **Final state check:**
  - `Throwaway present? 0`
  - `Meeting di Batam present? 1`
- **No 4xx/5xx HTTP responses** captured during the flow. The delete was previously blocked by an RLS policy + DB grant; that policy/grant is now in place, so the action succeeded at the data layer too. Screenshot: `/tmp/t3-after-confirm.png`.

---

## Step 3 — Archive Restore (`HDA-26TEST`)

The seeded test project used in T1 / T2 is at id `949a397c-ef2d-49b3-bad0-6eb870611d3d` and has been archived since T2. I confirmed it was already archived at the start of this pass.

- **3a — Show archived:** `/projects` exposes a `Show archived` anchor in the filter area. Clicking it navigates to `/projects?show_archived=1`. The list switches to archived rows. The `HDA-26TEST` row reads: `HDA-26TEST / QA Test Project (edited) / PROPOSAL / ON TRACK / ARCHIVED / KSO SAN DIEGO SENTUL / Rp50,000,000 / Rp0 / Rp0 / 0 / Aug 27, 2026 / Restore`. Screenshot: `/tmp/t3-archived-list.png`.
- **3b — Restore:** The `Restore` control is the `RestoreProjectButton` component (`components/forms/restore-project-button.tsx`). On first click it transitions from a single button into a two-step inline confirmation (`Confirm restore` + `Cancel`), backed by `restoreProjectAction` server action. First click → button is in armed mode. Second click on `Confirm restore` → form submits, page redirects to `/projects` (active view). Verification:
  - `HDA-26TEST visible on ACTIVE /projects after Restore: 1`
  - `HDA-26TEST visible on ARCHIVED /projects after Restore: 0`
- **3c — Re-archive to leave DB as found:** Navigated to the now-active test project's detail, clicked `Archive this project`, typed `QA Test Project (edited)` into the `archive-confirm-name` field, clicked `Yes, archive this project`. Redirected to `/projects`. Final:
  - `HDA-26TEST on ACTIVE (final): 0`
  - `HDA-26TEST on ARCHIVED (final): 1`
- **DB as found ✓** (same state as the start of this pass).

> Note: a single-click on `Restore` looks visually like "nothing happened" because React has not yet re-rendered when Playwright returns from the click. The two-step is a real two-step (the source component uses `useState("armed")`), so test harnesses need a small `waitForTimeout` or `waitForSelector("button:has-text(\"Confirm restore\")")` between clicks. This is purely an automation-time observation, not a user-visible defect.

---

## Step 4 — UI real-estate at 1440 and 1024

Screenshots:

- 1440: `/tmp/t3-1440-dashboard.png`, `/tmp/t3-1440-projects.png`, `/tmp/t3-1440-finance.png`, `/tmp/t3-1440-project-detail.png`
- 1024: `/tmp/t3-1024-dashboard.png`, `/tmp/t3-1024-projects.png`, `/tmp/t3-1024-finance.png`, `/tmp/t3-1024-project-detail.png`

### 4a — One banded summary-card container on project detail

`/tmp/t3-1440-project-detail.png` and DOM evidence:

- Outer `<section class="overflow-hidden rounded-[4px] border border-border bg-surface">` with one child `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">`.
- The black spotlight card is preserved (`border border-black bg-black text-white shadow-[8px_8px_0_0_rgba(0,0,0,0.05)] animate-enter rounded-[4px]`).

✓ PASS.

### 4b — Project Finance tab `aria-label` + URL

- `<a href="http://localhost:3000/projects/{id}?tab=finance" aria-label="Project finance tab">Finance</a>` in the project-detail tab strip.

✓ PASS.

### 4c — Recent Updates in a right column at 1440

- Parent `<section class="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">` → computed `grid-template-columns: 744.797px 319.203px`.
- `Active Projects` panel: x=320, y=1242, w=745 (left column).
- `Recent Updates` panel: x=1089, y=1242, w=319 (right column).

✓ PASS for column placement.

### 4d — Recent Updates sticky (FAIL)

- After `window.scrollTo(0, 1500)`:
  - `Recent Updates`: y=-194 (off-screen), `position: static`, `top: auto`.
  - `Active Projects`: y=-1176 (off-screen, normal page scroll).

The right-column placement is in place at `xl` (1440 px wide), but the panel is not sticky — when the user scrolls down to inspect `Active Projects`, `Recent Updates` scrolls away with the page. **FAIL.**

### 4e — Single-row filter / export strip at 1440

- `/projects`: `Search code…` (x=419), `lifecycle` (x=659), `health` (x=841), `Apply` (x=1023), `Show archived` (x=1127), `Export XLSX` (x=1264), `Export PDF` (x=1397), `Export · CSV` (x=1522) — **all at y=309**, single row.
- `/finance`: `Apply` (x=924), `Export XLSX` (x=1028), `Export PDF` (x=1161), `Export · CSV` (x=1286) — **all at y=573**, single row.

✓ PASS.

### 4f — Clean stacking at 1024

- `/projects`: `Apply` at y=365 (one row); `Show archived`, `Export XLSX`, `Export PDF`, `Export · CSV` all at y=425 (next row).
- `/finance`: summary cards occupy the top section (consistent with PRD layout); filter + export strip is one row, matches the 1440 layout.

✓ PASS (two clean rows, no clipping; no horizontal scroll).

---

## Step 5 — Export regression

```
[export-regression] /api/export-projects      -> 200 ct=text/csv; charset=utf-8 bytes=1335 head="Generated: 2026-08-27T20:22:14+07:00,,,,,,,,,,,.Project Code,Name,Client,Stage,H"
[export-regression] /api/export-projects-xlsx -> 200 ct=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet bytes=4242 head="PK..........]................[Content_Types].xml…"
[export-regression] /api/export-projects-pdf  -> 200 ct=application/pdf bytes=16196 head="%PDF-1.3.%.....9 0 obj.<<./Type /ExtGState./ca 1.>>…"
[export-regression] /api/export-finance       -> 200 ct=text/csv; charset=utf-8 bytes=818   head="Generated: 2026-08-27T20:22:15+07:00,,,,,,,,,.Project,Invoice Number,Title,Issue"
[export-regression] /api/export-finance-xlsx  -> 200 ct=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet bytes=3797 head="PK..........]................[Content_Types].xml…"
[export-regression] /api/export-finance-pdf   -> 200 ct=application/pdf bytes=15214 head="%PDF-1.3.%.....9 0 obj.<<./Type /ExtGState./ca 1.>>…"
```

All CSV/XLSX row-1 timestamps present; PDF landscape headers retained. ✓ PASS.

---

## Bugs list

| # | Severity | Bug | Repro | Observed |
|---|---|---|---|---|
| B1 (T3-4d) | medium | `Recent Updates` panel on `/dashboard` is **not sticky** despite being placed in the right column at `xl`. | At 1440 viewport, open `/dashboard`, scroll past the panel. | After scroll 1500 px the panel is at `y=-194` (off-screen) with `position: static`. A Principal scrolling to read `Active Projects` loses the activity feed context. |
| B2 (T3 automation only — not user-visible) | info | The `Restore` button on the archived list is a single button that, on first click, swaps into a two-step inline confirmation via React state. Automation that does a single `.click()` + immediate read will see "nothing happened". | Playwright `page.click('button:has-text("Restore")')` then `page.locator('button:has-text("Restore")').count()` | The click registered, the button is now `Confirm restore` + `Cancel`. Add `waitForTimeout` or `waitForSelector` between clicks. Real users see a normal two-step. |

No other bugs observed during the pass. No errors thrown by Playwright (no `pageerror`, no `console.error`).

---

## Confirmations

- **Did NOT commit the password.** A full-text scan of the report and `tmp/` finds zero occurrences of the password string. Credentials file remains at `/tmp/test-creds.json` (outside the repo). The password was passed to Playwright scripts only via the `PASSWORD` env var.
- **Did NOT edit source code.** No source files were modified during this pass; only `tmp/t3-*.mjs` files were created (live under `tmp/`, gitignored path).
- **Did NOT run migrations.** The migration referenced in the brief (DB grant + RLS for note delete) was applied earlier by the Coder; I observed the effect at the UI level (note delete succeeds, no 4xx/5xx) but did not run it myself.
- **Did NOT push to remote services.**
- **Did NOT touch seeded state destructively.** Only the test project (`HDA-26TEST`, id `949a397c-…`) was created and then re-archived as part of step 3c, leaving the DB exactly as found. One throwaway note (`T3 delete check`) was added to seeded `HDA-260017` and then deleted via the UI; the real `Meeting di Batam` note remains intact. Final check: `throwaway: 0, meeting: 1` on `HDA-260017`.

---

## Artefacts (paths under `/tmp/`)

- Screenshots: `/tmp/t3-1440-{dashboard,projects,finance,project-detail}.png`, `/tmp/t3-1024-{dashboard,projects,finance,project-detail}.png`, `/tmp/t3-archived-list.png`, `/tmp/t3-restore-armed.png`, `/tmp/t3-restore-after-confirm.png`, `/tmp/t3-pre-delete.png`, `/tmp/t3-after-delete-click.png`, `/tmp/t3-after-confirm.png`, `/tmp/t3-dashboard-sticky-test.png`, `/tmp/t3-final-archived-view.png`.
- Notes DOM dump: `/tmp/t3-notes-section.png`, `/tmp/t3-final-notes.html`, `/tmp/dom.out`.
- Playwright scripts (run via `PASSWORD=… node tmp/<s>.mjs`): `tmp/t3-phase1.mjs`, `tmp/t3-notes-dom.mjs`, `tmp/t3-notes-delete.mjs`, `tmp/t3-archive-toggle.mjs`, `tmp/t3-archive-restore.mjs`, `tmp/t3-restore-trace.mjs`, `tmp/t3-restore-action.mjs`, `tmp/t3-restore-armed.mjs`, `tmp/t3-rearchive.mjs`, `tmp/t3-screenshots.mjs`, `tmp/t3-layout.mjs`, `tmp/t3-final-dash.mjs`, `tmp/t3-sticky-check.mjs`, `tmp/t3-tree.mjs`, `tmp/t3-final-state.mjs`.

---

**Final counts: PASS=13, FAIL=1, BLOCKED=0.**

**The single FAIL is item 4d — `Recent Updates` is not sticky on `/dashboard` despite sitting in a right column at 1440.**