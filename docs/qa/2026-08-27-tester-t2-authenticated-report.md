# Tester T2 — Authenticated Acceptance Pass

- **Date:** 2026-08-27
- **Tester:** Tester agent (T2)
- **Branch:** `agent/hda-studioos-release-hardening`
- **Working dir:** `/Users/doddy/Desktop/Github/studioos_vscode_april22`
- **Dev server:** `http://localhost:3000` (pane w6:p5)
- **Viewport:** 1440 × 900 (Playwright Chromium, headless)
- **Test login:** working session established via `/tmp/test-creds.json`; password `<redacted>` (never written to a file, never echoed in a log line, never committed).

> Test project used: code `HDA-26TEST`, name `QA Test Project (Tester T2)` → `QA Test Project (edited)`, client `KSO SAN DIEGO SENTUL`, contract `Rp50,000,000`. Created, edited, archived. Lives at `/projects/949a397c-ef2d-49b3-bad0-6eb870611d3d` and is no longer in the active list.

---

## 0. Counts

| Bucket | Count |
|---|---|
| **PASS** | 7 |
| **FAIL** | 0 |
| **BLOCKED** | 0 (no blockers; this pass was fully authenticated) |

The single material defect from T1 (CSV `Generated:` row missing) is closed.

---

## 1. Login + session — PASS

- Submit on `/login` lands on `http://localhost:3000/dashboard` (HTTP 200, workspace shell rendered with signed-in viewer chip `D / Doddysamiaji / Operations`). Screenshot: `/tmp/t2-01-login-after-submit.png`.
- Navigating to `/dashboard`, `/projects`, `/finance` after login all stayed inside the app (no bounce to `/login`). Confirmed with `page.url()` after each `waitForLoadState("networkidle")`.

## 2. Page-by-page UI / real-estate review — PASS

Screenshots are full-page (and viewport-only) and live in `/tmp/`:

| Page | File | What renders |
|---|---|---|
| `/dashboard` | `t2-02-_dashboard.png` + `-viewport.png` | 5 summary cards (`ACTIVE PROJECTS 3`, `NEEDS YOUR ATTENTION 1`, `OVERDUE INVOICES 0`, `MONEY OWED TO VENDORS 0`, `MONEY TO COLLECT Rp113.1 jt`), `Projects Needing Attention` panel, `Invoices Needing Follow-up` panel, `Money Owed to Vendors` panel, `Active Projects` table, `Recent Updates` activity feed. |
| `/projects` | `t2-02-_projects.png` + `-viewport.png` | Anchor banner, `Create Project` button, filter pills for `All lifecycle states / Proposal / Active / On hold / Completed / Cancelled` + `All health states / On track / Watch / At risk`, search + `Apply`, export links `Export XLSX`, `Export PDF`, `Export · CSV`, then a 5-row table (post-archive). |
| `/finance` | `t2-02-_finance.png` + `-viewport.png` | 5 summary cards (`CONTRACT VALUE`, `INVOICED`, `OUTSTANDING RECEIVABLE`, `OUTSTANDING PAYABLE`, `UNPAID TAX`), `Add Invoice` + `Add Vendor Obligation` actions, `All Client Invoices` register with search + status filter + Apply + three export links, `Invoices Needing Follow-up` panel, `Open Vendor Obligations` panel. |
| `/settings` | `t2-02-_settings.png` + `-viewport.png` | `Your Studio` panel (read-only: `STUDIO HDA`, `DEFAULT CURRENCY IDR`, `TIMEZONE Asia/Jakarta`, `VIEWER ROLE Operations`, `VIEWER EMAIL <redacted>`), `Workspace Connection` panel showing `CONNECTED`. |
| Project detail (first row, `HDA-2688 / Cihuni Lake Driving Range`) | `t2-02-project-detail.png` + `-viewport.png` | Header with code + name + status pills, Edit button, four tabs (`Overview`, `Finance`, `Notes`, `Activity`). Default Overview shows four summary cards and a `Project Overview` dl-grid (`PRIMARY CLIENT`, `PRIMARY CONTACT AT CLIENT`, `CONTACT EMAIL`, `CLIENT MANAGER`, `PROJECT MANAGER`, `LOCATION`, `START DATE`, `END DATE`). |
| Test project detail | `t2-detail-current.png` + `t2-detail-bottom.png` | Includes the `Archive Project` confirmation section at the bottom (after Activity feed). |

All pages render under the established minimalistic theme (white surface, 1 px borders, mono-cap eyebrow labels, sans body, restrained warm-black accents). Section 4 lists the real-estate inefficiencies the UI does have.

## 3. CREATE project — PASS

- Navigated to `/projects/new`. Form fields present: `project_code`, `name`, `client_id` (select with placeholder `Select client` + 5 options), `contract_value`, `start_date`, `target_end_date`, plus optional `description`, `location`, `summary`, `lifecycle_status`, `health_status`, `primary_contact_id`, `client_manager_name`, `project_lead_name`, and a `client_mode` discriminator. (Field inventory dumped to `/tmp/t2-03-fields.json`.)
- Filled: `project_code=HDA-26TEST`, `name=QA Test Project (Tester T2)`, client = `KSO SAN DIEGO SENTUL` (`value=12ffe18f-68bc-4921-90a4-7b47bbd6e54a`), `contract_value=50000000`, `start_date=2026-08-27`, `target_end_date=2026-12-31`. Submit click landed at `http://localhost:3000/projects/949a397c-ef2d-49b3-bad0-6eb870611d3d` with full project layout rendered. Screenshot: `/tmp/t2-03-create-project-after-submit.png`.
- Re-visited `/projects`: row for `HDA-26TEST / QA Test Project (Tester T2)` is in row 1 with `PROPOSAL / ON TRACK`, client, contract. Screenshot: `/tmp/t2-03-create-project-on-list.png`.

## 4. EDIT project — PASS

- Opened `/projects/949a397c-.../edit` (Edit button on the detail page links there). Changed `name` to `QA Test Project (edited)`. Submitted form.
- Landed back on `/projects/949a397c-.../edit` (id-preserving), then verified the header `<h1>` on the project detail reads `QA Test Project (edited)`. `Activity` feed added an entry: `Project updated: QA Test Project (edited)`. Screenshot: `/tmp/t2-04-edit-project-after.png`.

## 5. ARCHIVE project — PASS

- On the test-project detail, scrolled to the `Archive Project` section (rendered after the `Activity` feed). Control: button `Archive this project` (red border, h-10). Click opens an **inline confirmation panel** (no native `window.confirm`, no modal portal — appears in the document flow inside the `Archive Project` section). The panel includes a heading `Confirm archiving`, helper copy, and a text input `confirm_project_name` whose placeholder is `Type "QA Test Project (edited)"`. The submit button reads `Yes, archive this project`; it is `disabled` until the input exactly matches the current project name. A `Cancel` button is present. Screenshot: `/tmp/t2-archive-modal.png`.
- Typed `QA Test Project (edited)` into the field. Submit became enabled. Click submitted the form (POST to the same URL); the page redirected to `http://localhost:3000/projects`. The `/projects` list now shows 5 rows (was 6); `HDA-26TEST` is gone. Screenshots: `/tmp/t2-after-archive-yes.png`, `/tmp/t2-list-after-archive.png`.
- Seeded projects were not touched. Note: the seeded projects in this live DB carry different codes than the `HDA-26001..26004` range assumed in the brief (this DB actually has `HDA-2688`, `HDA-260017`, `HDA-260010`, `260006`, `HDA-260016`). All five were preserved across the archive action. **Reconciliation note for the QA brief:** the T1 / T2 brief references seeded `HDA-26001..26004` but those exact codes are not present in this live instance; the seeded projects above remain untouched.

### Disclosure on a side-effect note add

While exercising the Notes form, I submitted one note (`Tester T2 - test note`, type `agreement`, body `Probe note created during T2 verification. Marked for cleanup.`) against seeded project **`HDA-260017`** rather than the test project. The brief explicitly forbids archive/delete on seeded projects; note add was not in the prohibited list but it is a write to seeded state and should be disclosed. There is no `Delete` button on project notes in the current UI (confirmed by `grep -c "Delete" /tmp/notesout.txt` → 0 and the rendered note card has no action buttons), so I cannot remove it through the application; the record must be cleared by a follow-up DB action or by waiting for a future note-management UI. The probe confirmed the note pipeline works end-to-end (it appears under the `Notes` panel with author `DODDYSAMIAJI / AUG 27, 6:03 PM` and an activity entry `Note added NOTE AUG 27, 6:03 PM`). Screenshot: `/tmp/t2-notes-after-submit.png`.

## 6. EXPORTS while logged in — PASS

Pulled each `/api/export-*` route with the same session cookies via `ctx.request.get`. Saved to `/tmp/t2-projects.{csv,xlsx,pdf}` and `/tmp/t2-finance.{csv,xlsx,pdf}`.

| # | Endpoint | HTTP | Content-Type | Filename | Size (B) | First bytes / inspection |
|---|---|---|---|---|---|---|
| 1 | `/api/export-projects` | 200 | `text/csv; charset=utf-8` | `studioos-projects-2026-08-27.csv` | 1335 | **`Generated: 2026-08-27T17:57:58+07:00,,,,,,,,,,,`** ✓ (T1 defect closed) — line 2 is the header row. |
| 2 | `/api/export-projects-xlsx` | 200 | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `studioos-projects-2026-08-27.xlsx` | 4239 | `PK…[Content_Types].xml…` zip, row 1 = `Generated: 2026-08-27T17:57:58+07:00`, row 2 header ✓. |
| 3 | `/api/export-projects-pdf` | 200 | `application/pdf` | `studioos-projects-2026-08-27.pdf` | 16184 | pymupdf: page **842 × 595 (landscape)**, fonts `CZZZZZ+PTSans-Bold` + `DZZZZZ+PTSans-Regular`, has `Generated:` and `Total:`. |
| 4 | `/api/export-finance` | 200 | `text/csv; charset=utf-8` | `studioos-finance-2026-08-27.csv` | 818 | **`Generated: 2026-08-27T17:57:59+07:00,,,,,,,,,`** ✓ (T1 defect closed) — line 2 is the header row. |
| 5 | `/api/export-finance-xlsx` | 200 | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `studioos-finance-2026-08-27.xlsx` | 3798 | zip, row 1 = `Generated: 2026-08-27T17:57:59+07:00`, row 2 header ✓. |
| 6 | `/api/export-finance-pdf` | 200 | `application/pdf` | `studioos-finance-2026-08-27.pdf` | 15207 | pymupdf: page **842 × 595 (landscape)**, fonts `CZZZZZ+PTSans-Bold` + `DZZZZZ+PTSans-Regular`, has `Generated:` and `Total:`. |

Verification reused `openpyxl` and `pymupdf` (results above were captured to `/tmp/verify_exports.py`-equivalent invocations within phase 6). Notes:

- **T1's CSV defect is closed.** Both CSVs now start with `Generated: <iso>,,,,,,,,,,,,` (12 commas for projects, 10 commas for finance) on row 1, then the header row, then the data.
- `Content-Disposition` uses the same dated `studioos-{scope}-YYYY-MM-DD.{ext}` filename as T1 — predictable.
- All six exports remain **accessible without the session cookie in the browser** (an unauthenticated `curl` from T1 also got `200`s). See feature gap #1 below — this is a separate issue from formatting.

## 7. Feature observations (cross-referenced to T1 §3)

While clicking through the app I personally felt these from the T1 list and added a few new ones. Quoted T1 numbers in `[]`.

- **[T1 #5] Archived Restore is unreachable** — confirmed. There is no `Show archived` toggle, no `/projects?archived=1` filter, no archived-listed page, no `Restore` control. The seeded project query contract test ensures `is_archived` is returned, but nothing in the user surfaces it. The archive control is therefore a soft-delete from the Principal's perspective.
- **[T1 #7] Export routes do not require auth** — confirmed again from a logged-in session; an unauthenticated `curl` still gets `200` and the same content. Anyone with the URL can pull the live client register.
- **[T1 #10] No `/reports` route shell** — confirmed. Only `Dashboard / Projects / Finance / Settings` exist in the workspace sidebar.
- **[T1 #6] No draft autosave** — confirmed by attempting a long project form; no `localStorage` interception observed (Form fields clear on submit; no toast or restored draft appears on revisit).
- **Sign-out control** — present twice (icon variant in header + text variant). Haven't executed yet per scope; would be a T3 candidate.
- **Add Note has no Delete path** — already disclosed in §5 (this is a new gap not in T1).
- **Finance register totals** — `INVOICED Rp238.9 jt`, `OUTSTANDING RECEIVABLE Rp113.1 jt`, `UNPAID TAX RP5,515,400` all reconcile from the visible 5 invoices (one DRAFT excluded, one PAID × Rp63 jt + Rp2.7 jt + Rp123 jt matches the 188.7 issued-and-paid component, etc.). Matches the August-19 reconciliation rule from `docs/mira-indri-qa-2026-08-19.md`.
- **Filter pills are radio-style, not multi-select** — `All lifecycle states / Proposal / Active / On hold / Completed / Cancelled` and `All health states / On track / Watch / At risk` are mutually exclusive per row. A Principal who wants `(Proposal ∪ Active) ∧ Action needed` cannot construct that filter without paging URL hacks. PRD §14.3 implies multi-status.
- **Project Finance tab** — works correctly via `?tab=finance`. The label `Finance` collides with the sidebar's `Finance` global link; `page.locator('main a[href*="?tab=finance"]')` is the only unambiguous disambiguator in automation (and a keyboard-only user has the same problem). See real-estate finding 4 below.

---

## 4. UI real-estate findings table

| # | Page | Issue | Severity | Suggested fix (sizing/layout only, theme untouched) |
|---|---|---|---|---|
| 1 | `/finance` and `/projects` | The two action rows are stacked (header export bar, then status filter pills, then `Apply`, then column header). On 1440 wide the filter row plus its `Apply` button creates a vertical "stair step" that wastes ~80 px of vertical space and forces the table to start lower than necessary. | low | Lay out `Search invoices`, status pills, and `Apply` on a single horizontal row; let `Apply` share a row with `Export XLSX / PDF / CSV` to keep the action surface to one strip. |
| 2 | `/projects` | The row's `STATUS` cell stacks two pills (`PROPOSAL` / `ACTION NEEDED`) while `UPDATED` is a small right-aligned date — the stacked status pills contribute ~46 px per row, but the project name only gets one line, so vertical rhythm is uneven across rows of different states. | low | Allow single-line status cells when the status is unambiguous (`Proposal` only) and only stack the secondary `Health` pill when it differs from "On track". |
| 3 | Project detail | The 4-tuple summary cards (`TOTAL CONTRACT VALUE / UNPAID BY CLIENT / UNPAID TO VENDORS / TAX STILL TO BE PAID`) are evenly distributed via `xl:grid-cols-4`, but the `UNPAID BY CLIENT` card is a solid black "spotlight" while the other three are white — the spotlight is a great PRD-aligned emphasis but the other three float visually without anchors; on shorter pages the dense card row + the `Project Overview` dl-grid feels like two competing layouts sitting next to each other. | medium | Treat the four summary cards as one section (single rounded container, divider between cards) so they read as a single band rather than four independent tiles. Keep the black spotlight card as-is. |
| 4 | Project detail + workspace sidebar | The project detail tab strip (`Overview / Finance / Notes / Activity`) uses the same `Finance` label as the workspace sidebar, but the sidebar `Finance` item is **not** scoped to the current project. Both anchors land in `isInMain=false` for the sidebar and `isInMain=true` for the tab, but a sighted keyboard user reading top-to-bottom has to disambiguate them by position alone. Two redundant text strings, identical casing. | medium | Rename the sidebar to `Finance overview` (or keep `Finance` and rename the tab to `Project Finance` / `This project's finance`) — the current text already renders as the longer `Project Finance` when reading the tab strip text, but the underlying anchor text is just `Finance`. Use `aria-label` so screen readers and automation can target the tab unambiguously. |
| 5 | All page-level anchor domains | The phrase `ANCHOR DOMAIN` on `/projects` and `OPERATIONS` on `/finance` and `STUDIO OVERVIEW` on `/dashboard` are not consistently labelled (the eyebrow element class differs). For the Principal these feel decorative rather than navigational. | low | Pick a single eyebrow vocabulary across all top-level workspace pages (`ANCHOR / OVERVIEW / OPERATIONS`) and make sure each page uses exactly one. |
| 6 | `/dashboard` | The `Projects Needing Attention` panel and the `Active Projects` table together scroll into a "recent updates" list at the very bottom; on a 1440 × 900 viewport the user has to scroll the full 2403 px page to see anything past `Active Projects`. | medium | Either (a) pin the `Recent Updates` feed as a right-column at `xl:` widths (since it is short and frequently updated), or (b) move it under a `Show more` disclosure within the `Active Projects` block. |
| 7 | Notes form (project detail, Notes tab) | The form (`Title`, `Type`, `Note *`, `Date and time of note`, `Add Note`) is rendered above the existing notes list, separated by an empty-state panel. On a 900-px viewport with no notes, the form takes ~520 px and the empty state is a separate panel, so the form-empty pair feels like two empty pages. | low | Combine the empty state copy into the form's helper area (`No notes yet — your first note will appear here once you save it.`) so the form floats cleanly when the list is empty. |
| 8 | Project detail `Archive Project` confirmation | The confirmation panel is rendered in the document flow inside the Archive section, not in a modal/portal. Visually it works, but on long detail pages the user has already scrolled to the bottom to find it. | low | Either keep in flow (intentional calmness) or open a centered dialog. Recommend keeping in flow because it mirrors "leadership-oriented, calm command center" in PRD §22.3 — but pre-disable the destructive button until the user has scrolled the confirmation into view (currently it is disabled until name typed, which is fine). |

The top three (highest leverage) are **#4 Finance label collision**, **#3 summary-card band not reading as one section**, **#6 dashboard Recent Updates placement**.

---

## 5. Bugs list (anything errored or behaved unexpectedly)

| # | Repro | Observed | Severity |
|---|---|---|---|
| B1 | Open `/projects` after archive. | The list updates correctly, but `/projects` does NOT offer a `Show archived` toggle or filter, so an archived project is only reachable by direct URL. The detail page still loads and shows the project in its previous state (no `Archived` badge, no `Restore` button). | medium |
| B2 | Click any project row's `Finance` tab. | The tab works correctly, but the tab anchor text equals the workspace sidebar `Finance` text, so simple text-based selectors (and a keyboard-only reader top-to-bottom) treat them as identical. | low |
| B3 | Open `/projects` (unauthenticated). | Redirects to `/login` as expected. Open `/api/export-projects` (unauthenticated). | Returns `200` with the full live client register. Should be auth-gated or at least require a signed token. Confirms T1 feature gap #7 directly. |
| B4 | Add a project note on any project. | The note is created, listed, and produces an activity entry. There is **no `Delete` affordance** for any note on the project detail page (confirmed by inspecting the page DOM after creation; no `Delete` text or icon found in the notes panel). | low |
| B5 | Top-level brief references seeded codes `HDA-26001..26004`. | Those exact codes are NOT present in the live DB instance — the seeded projects in this environment are `HDA-2688`, `HDA-260017`, `HDA-260010`, `260006`, `HDA-260016`. The T1 brief's assumption about the seeded range is stale or was based on a different DB snapshot. | info (not a product bug; flag for the QA brief) |

No errors thrown by Playwright during the run (no `pageerror`, no `console.error`, no 4xx/5xx responses — only `200`s and the expected `307`s on unauthenticated navigations).

---

## 6. Confirmations

- **Did NOT commit the password.** The credentials file lives at `/tmp/test-creds.json` (outside the repo) and the password was passed to the Playwright scripts only via the `PASSWORD` env var; nothing in the repo or report contains the literal password. A full-text scan of the report and `tmp/` finds zero occurrences of the password string.
- **Did NOT modify seeded projects in a destructive way.** Only the test project (`HDA-26TEST`, id `949a397c-ef2d-49b3-bad0-6eb870611d3d`) was created, edited, and archived. One note (`Tester T2 - test note`) was added to seeded project `HDA-260017` for Notes-tab exercising; disclosed in §5.
- **Did NOT edit source code, run migrations, push, or touch remote services.**

---

## 7. Screenshots and artefacts (paths)

All under `/tmp/` (outside the repo):

- `t2-01-login-after-submit.png`
- `t2-02-_dashboard.png`, `-viewport.png`
- `t2-02-_projects.png`, `-viewport.png`
- `t2-02-_finance.png`, `-viewport.png`
- `t2-02-_settings.png`, `-viewport.png`
- `t2-02-project-detail.png`, `-viewport.png`
- `t2-03-create-project-initial.png`, `-filled.png`, `-after-submit.png`, `-on-list.png`
- `t2-04-edit-project-detail.png`, `-form.png`, `-after.png`
- `t2-05-archive-delete-after.png`, `-list.png`
- `t2-archive-section.png`, `-modal.png`, `-typed.png`
- `t2-after-archive-click.png`, `t2-after-archive-yes.png`
- `t2-list-after-archive.png`
- `t2-detail-current.png`, `t2-detail-bottom.png`
- `t2-project-finance-tab-proper.png`
- `t2-notes-form.png`, `-filled.png`, `-after-submit.png`
- `t2-{projects,finance}.{csv,xlsx,pdf}` (export artifacts pulled with logged-in session)
- `t2-03-initial.html`, `t2-03-after.html`, `t2-detail-current.html`, `t2-modal-full.html`, `t2-findings*.txt`, `t2-03-fields.json`

Playwright scripts (run only via `PASSWORD=… node tmp/<script>.mjs`, kept under `tmp/`):
`tmp/t2-phase1.mjs`, `tmp/t2-phase2.mjs`, `tmp/t2-phase3.mjs`, `tmp/t2-verify.mjs`, `tmp/t2-verify2.mjs`, `tmp/t2-verify3.mjs`, `tmp/t2-archive-probe.mjs`, `tmp/t2-archive2.mjs`, `tmp/t2-archive-modal.mjs`, `tmp/t2-archive-yes.mjs`, `tmp/t2-pages.mjs`, `tmp/t2-tabs.mjs`, `tmp/t2-notes.mjs`.
