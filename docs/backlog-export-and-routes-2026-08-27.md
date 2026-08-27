# Backlog — Deferred Items (do NOT dispatch this round)

Captured 2026-08-27 by Orchestrator after PM scope override. These items were investigated and verified-correct, but PM deferred them in favour of the E1/E2/E3 export scope (see `/tmp/pm-redirect.md`).

Do NOT work on these this round. They are recorded here so the investigation is not lost.

## B1 — Wire up the Documents and Notes & Activity pages + sidebar entries

**Status:** investigated, confirmed as a real PRD-implied gap. Not dispatched.

**Evidence:**
- PRD §11.1 lists Documents and Notes & Activity in main nav.
- `docs/controlled-vocabulary.md` lists `/documents` and `/activity` as canonical routes; `/notes` is a redirect alias to `/activity`.
- `lib/studio-data.ts` already exports `getDocumentsPageData()` (line 863) and `getActivityPageData()` (line 876).
- `app/(workspace)/actions.ts` already calls `revalidatePath("/documents")` and `revalidatePath("/activity")` (lines 202–203).
- `app/` has no `app/(workspace)/documents/` and no `app/(workspace)/activity/` directories.
- `lib/navigation.ts` sidebar only lists 4 items: Dashboard, Projects, Finance, Settings — missing Documents and Notes & Activity.

**Planned scope (carry-over from PM plan, do not run):**
- NEW `app/(workspace)/documents/page.tsx`
- NEW `app/(workspace)/activity/page.tsx`
- `lib/navigation.ts` — add Documents and Notes & Activity entries.
- `components/shell/mobile-nav.tsx` — add same two entries.

**Files expected to change:** the four above only.

**Designer hint:** Reuse `PageHeader`, `SectionPanel`, `MetricCard`, `StatusBadge` primitives. Table for documents (Category / Project / Required / Available / Status / Last Updated). Two-column Notes + Activity layout. No new components.

**Constraints when eventually run:** No schema, no migrations, no new vocabulary, no new data functions. Reuses existing primitives. Keep all 161 existing tests green.

## B2 — Add focused unit tests for the new Documents and Activity pages

**Status:** carry-over. Pure additive; no app/component/lib edits. Run only after B1 ships.

**Files:** NEW `tests/unit/documents-page-data.test.ts`, NEW `tests/unit/activity-page-data.test.ts`.

## B3 — Verify loading.tsx cascades to new routes

**Status:** carry-over. May be a no-op if `app/(workspace)/loading.tsx` already cascades. Run only after B1 ships.

---

## Why deferred

PM redirected to E1/E2/E3 (export scope, see `/tmp/pm-redirect.md`). The export scope was driven by Ibu Indri's Bahasa Indonesia feedback: "Ekspor data Studio App ke XLS untuk laporan lebih lengkap; selesaikan isu Project Owner/Lead yang belum muncul."

B1/B2/B3 remain valid V1 work and can be picked up in a subsequent round without re-investigation.