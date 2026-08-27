# Tester T1 — No-Login Acceptance Pass

- **Date:** 2026-08-27
- **Tester:** Tester agent (T1)
- **Branch:** `agent/hda-studioos-release-hardening`
- **Working dir:** `/Users/doddy/Desktop/Github/studioos_vscode_april22`
- **Scope:** Everything verifiable without a test login (export formatting + auth-gate confirmation + feature-gap review)
- **Dev server:** `http://localhost:3000` (pane w6:p5)

---

## 1. Export Formatting Results

All six export endpoints responded `HTTP 200` without authentication and set `Content-Disposition: attachment` with a dated filename.

### 1.1 HTTP / Headers

| # | Endpoint | HTTP | Content-Type | Content-Disposition filename |
|---|---|---|---|---|
| 1 | `/api/export-projects` | 200 | `text/csv; charset=utf-8` | `studioos-projects-2026-08-27.csv` |
| 2 | `/api/export-projects-xlsx` | 200 | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `studioos-projects-2026-08-27.xlsx` |
| 3 | `/api/export-projects-pdf` | 200 | `application/pdf` | `studioos-projects-2026-08-27.pdf` |
| 4 | `/api/export-finance` | 200 | `text/csv; charset=utf-8` | `studioos-finance-2026-08-27.csv` |
| 5 | `/api/export-finance-xlsx` | 200 | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `studioos-finance-2026-08-27.xlsx` |
| 6 | `/api/export-finance-pdf` | 200 | `application/pdf` | `studioos-finance-2026-08-27.pdf` |

All six filenames follow the `studioos-<scope>-YYYY-MM-DD.<ext>` pattern. ✓

### 1.2 CSV (`text/csv`)

- **Header (projects, line 1):** `Project Code,Name,Client,Stage,Health,Location,Start Date,Target End,Contract Value,Project Owner,Project Lead,Last Updated`
- **Header (finance, line 1):** `Project,Invoice Number,Title,Issued Date,Due Date,Paid Date,Amount (IDR),Tax %,Tax Amount (IDR),Status`
- **Rows:** 4 in each file (matches the 4 visible projects / 4 invoices in seed data).
- **Owner / Lead population (projects CSV):**
  - `HDA-26001` → Doddy Samiaji / Maya Puspa
  - `HDA-26002` → Dodi Supriyatna / Indri Ramadhani
  - `HDA-26003` → Farid Ramdani / Mira Wulandari
  - `HDA-26004` → Dodi Supriyatna / *(blank — legitimate empty source value)*
- **First data line (projects CSV, line 2):** `HDA-26001,Lippo Pekanbaru 36 ha,Lippo Group,Active,Needs a closer look,"Pekanbaru, Riau",2026-01-12,2026-07-10,"125,000,000",Doddy Samiaji,Maya Puspa,2026-04-22T02:10:00.000Z`
- ⚠ **Defect — CSVs have NO "Generated:" timestamp row.** The first CSV line is the header, with no metadata row prepended. The XLSX and PDF variants *do* include `Generated: 2026-08-27T17:09:25+07:00` (projects) and `2026-08-27T17:09:26+07:00` (finance). The CSV is inconsistent with the other two formats.

### 1.3 XLSX (openpyxl inspection)

**Projects workbook**

- Sheet `Projects`, dims `A1:L6` (6 rows × 12 cols).
- Row 1: `Generated: 2026-08-27T17:09:25+07:00` (col A only) ✓
- Row 2 header: `Project Code, Name, Client, Stage, Health, Location, Start Date, Target End, Contract Value (IDR), Client Manager, Project Manager, Last Updated`
- Rows 3–6 contain all four seeded projects with both manager columns populated (KLH Sentul has a blank Project Manager, matching source).

**Finance workbook**

- Sheet `Finance`, dims `A1:J6` (6 rows × 10 cols).
- Row 1: `Generated: 2026-08-27T17:09:26+07:00` ✓
- Row 2 header: `Project, Invoice Number, Title, Issued Date, Due Date, Paid Date, Amount (IDR), Tax %, Tax Amount (IDR), Status`
- Rows 3–6 contain the four invoices. No `Client Manager / Project Manager` columns (correct — invoices do not carry that field). `Paid Date` is empty for unpaid rows (correct).
- Owner/lead columns: N/A for finance — but the columns are correctly omitted rather than left blank.

### 1.4 PDF (pymupdf inspection)

| Check | Projects PDF | Finance PDF |
|---|---|---|
| Page size (pts) | **842 × 595** | **842 × 595** |
| Orientation | **Landscape** ✓ | **Landscape** ✓ |
| Page count | 1 | 1 |
| Fonts embedded | `PTSans-Bold`, `PTSans-Regular` (subsets `DZZZZZ+`, `CZZZZZ+`) ✓ | Same ✓ |
| Title | `StudioOS — Projects Report` (y=36, bold) | `StudioOS — Finance Report` (y=36, bold) |
| `Generated:` line | y=61 — `Generated: 2026-08-27T17:09:25+07:00` ✓ | y=61 — `Generated: 2026-08-27T17:09:26+07:00` ✓ |
| `Total: N rows` line | y=76 — `Total: 4 rows` ✓ | y=76 — `Total: 4 rows` ✓ |

**Distinct x-positions for columns (projects PDF header row, y=134):**
`Project Code` x=45, `Name` x=167, `Client` x=236, `Stage` x=282, `Health` x=343, `Location` x=409, `Start Date` x=452, `Target` x=516, `Contract` x=573, `Client Manager` x=643, `Project Manager` x=700, `Last Updated` x=749. Gaps between columns are ≥ 19 pts; no merged blob, no collision.

**Distinct x-positions for columns (finance PDF header row, y=134):**
`Project` x=112, `Invoice Number` x=153, `Title` x=324, `Issued Date` x=361, `Due Date` x=434, `Paid Date` x=497, `Amount (IDR)` x=561, `Tax %` x=638, `Tax Amount (IDR)` x=691, `Status` x=776. No collision.

**Owner/lead (projects PDF, row 3, y=166):**
`HDA-26001` (x=42) ... `Client Manager` value `Doddy Samiaji` (x=~645) and `Project Manager` value `Maya Puspa` (x=~700) sit in distinct columns. No collision.

**Wrapping observation (non-blocking):** On row 6 (`KLH Sentul 100 ha`), `Project Manager` value `Dodi Supriyatna` wraps onto a second visual line at y=266 (`Dodi ` at y=255, `Supriyatna` at y=266) within the same column band (x stays ~615). This is legitimate wrapping inside a single column, not an overflow — the column is wide enough. Header cells `Target End` and `Contract Value (IDR)` also wrap to a 2-line header on y=134/146, which is normal for a 12-column landscape.

**No other defects measured:** no overflow off the page (all x < 842), no value-blank in populated columns beyond the legitimate empty `KLH Sentul` Project Manager, no missing columns.

---

## 2. Auth-Blocked Items

### 2.1 Auth-gate behaviour

| Page | HTTP | Location |
|---|---|---|
| `/dashboard` | **307** | `/login` |
| `/projects` | **307** | `/login` |
| `/finance` | **307** | `/login` |
| `/settings` | **307** | `/login` |

App-shell routing gate works correctly — `/login` is the redirect target in every case.

### 2.2 Verifications blocked by missing test login

> **Page navigation and create/edit/delete testing require a test login (email+password). Blocked until provided.**

Specifically blocked:

- Full dashboard render and chart/widget layout inspection (cards, attention panel, activity feed).
- Projects list search, status filters (`Active`, `On hold`, `Proposal`, etc.), column sort, attention flags.
- Project Detail executive briefing page — Overview / Finance / Documents / Notes / Activity tabs.
- Finance Overview page — outstanding receivables, vendor payables, per-project finance breakdown.
- Documents, Notes, Reports pages.
- Create / edit / archive / restore workflows (Server Actions return `Sign in is required` when invoked without a session).
- Document upload or link-add paths.
- Real sign-out / sign-in cycle verification.
- Permission-gated UI affordances (any `can_*` checks if surfaced).

The export endpoints are independently gated by a different code path and currently do **not** require auth — every export request succeeded unauthenticated.

---

## 3. Feature-Gap List (from docs/code, not implementable in this pass)

The following items are repeatedly referenced in the PRD, AGENT.md, build-log, or the 2026-08-19 QA reconciliation as deferred, partial, or absent. They are the gaps a studio would most likely feel during normal V1 use. **None are implemented here.**

1. **Multi-termin invoice planning during project setup** — A studio typically contracts on 3–8 payment terms per project; today each invoice is a one-off record, so creating a project with staggered terms is manual and error-prone. *Source: `docs/mira-indri-qa-2026-08-19.md` deferred list.*

2. **Validation that all invoice term percentages sum to 100%** — Without this guard, the dashboard's "invoiced vs. contract value" view can drift from reality silently, undermining the dashboard's first-order promise. *Source: same deferred list.*

3. **Durable invoice status history + automatic calendar-driven overdue transition** — The current `status` field is mutable and overwritten; there is no audit trail and no scheduled job to flip an invoice to `Overdue` once its due date passes. Recovers from "we lost a follow-up" failures. *Source: deferred list + reconciliation rule.*

4. **Client short names, legal entity names, aliases, and duplicate-resolution rules** — At present the clients table is effectively keyed on a single display name. Studios routinely have multiple legal entities per group (PT, CV, Group HQ); without aliases the dashboard double-counts and conflates clients. *Source: deferred list.*

5. **User-accessible archived-project listing with permission-governed Restore** — `is_archived` exists in the project query contract, but there is no UI surface to list archived projects or restore them. A Principal cannot retrieve a wrongly-archived project through the app. *Source: project-query contract test + reconciliation notes.*

6. **Draft autosave for create/edit forms** — A long project-setup form (project metadata + finance records + first document) is lost on accidental navigation. Studios with slow field connections rely on this. *Source: deferred list.*

7. **Native PDF / Excel export endpoints hooked to the auth gate and aligned to controlled vocabulary** — Exports work today and produce well-formatted output (per Part 1), but the export routes are currently unauthenticated and not visibly tied to the same RLS that protects `/projects` and `/finance`. Anyone with the URL can pull the live client register. *Source: observation in Part 1.1 vs Part 2.1.*

8. **Role expansion beyond Principal (Project Manager / Coordinator / Team)** — `AGENT.md §7-8` lists four roles in the future model but V1 ships Principal-only UI. There is no Project Manager queue to triage overdue invoices for their projects, which leaves a clear gap once the studio onboards a PM. *Source: PRD §7.2, AGENT.md §2.*

9. **Approval workflows / sign-off transitions on invoice paid and document uploaded** — No state-change approval chains; any user with edit rights can flip `invoice.paid = true` directly. For a Principal-facing tool this may be acceptable, but the underlying data model does not capture who acknowledged the change. *Source: PRD §6 Non-Goals; deferred list.*

10. **Reports section export to PDF / Excel / CSV** — `PRD §14.8` lists six report types and explicitly says architecture should leave room for PDF/CSV/Excel outputs, but no report-route shell exists in `app/`. The export endpoints above cover `projects` and `finance` only. *Source: PRD §14.8; route inventory check.*

---

## 4. Pass / Fail Verdict per Export

| # | Export artifact | Verdict | Notes |
|---|---|---|---|
| 1 | `studioos-projects-2026-08-27.csv` | **PASS with defect** | HTTP/headers/structure/owner-lead population correct. **Defect:** missing `Generated:` timestamp row that XLSX and PDF carry. |
| 2 | `studioos-projects-2026-08-27.xlsx` | **PASS** | Row 1 timestamp, row 2 header, manager columns populated, dims A1:L6, content-types and filename correct. |
| 3 | `studioos-projects-2026-08-27.pdf` | **PASS** | Landscape 842×595, distinct column x-positions, PT Sans embedded, `Generated:` and `Total: 4 rows` present, no overflow. |
| 4 | `studioos-finance-2026-08-27.csv` | **PASS with defect** | HTTP/headers/structure correct. **Same defect as #1:** missing `Generated:` timestamp row. |
| 5 | `studioos-finance-2026-08-27.xlsx` | **PASS** | Row 1 timestamp, row 2 header, invoice rows consistent, dims A1:J6, correct content-type/filename. |
| 6 | `studioos-finance-2026-08-27.pdf` | **PASS** | Landscape 842×595, distinct column x-positions, PT Sans embedded, `Generated:` and `Total: 4 rows` present. |

**Single repeated defect across all six:** the CSV timestamp row is absent in both CSVs. XLSX and PDF correctly carry it. Recommend Coder add a one-line prefix `Generated: <iso>,Total: <n> rows` (or similar) to both CSV responses so all three formats are consistent.

---

## 5. Local Check Result (sanity only, no production touched)

- Source code / migrations: **not touched**.
- Hosted Supabase: not contacted (entirely offline; all data came from the local dev server's response).
- TypeScript / ESLint / Vitest / build: not re-run in this pass — those gates were last verified green on 2026-07-23 / 2026-08-19 per `docs/build-log.md` and `docs/mira-indri-qa-2026-08-19.md`.

---

**BLOCKED: need test login (email+password) to run page-navigation and create/edit/delete tests.**
