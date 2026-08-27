# D-SPEC — UI Real-Estate Surgical Pass (Top 4 Tester Findings)

**Date:** 2026-08-27
**Source:** `docs/qa/2026-08-27-tester-t2-authenticated-report.md` §4
**Scope:** Sizing/layout only. Existing theme, fonts, colors, components, and Tailwind tokens are untouched. No new dependencies. No new shared components.

---

## 1. Finance label collision (Tester #4, medium)

### Where to change

**File:** `app/(workspace)/projects/[projectId]/page.tsx`
**Current class string to locate:**

```
const tabs: Array<{ key: string; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "finance", label: "Finance" },
  { key: "notes", label: "Notes" },
  { key: "activity", label: "Activity" },
];
```

(The tab strip's outer `<div className="flex gap-0 border-b border-border">` and the per-link `relative px-4 py-3 text-sm font-medium transition-colors` stay exactly as-is.)

### Replacement

Keep the **visible** tab text as `Finance` — the calmer option per Design §10 ("calm", "minimal"). Add an `aria-label` on each tab `<Link>` so screen readers and automation can disambiguate the project-detail `Finance` tab from the workspace sidebar's `/finance` link. Concretely:

```tsx
const tabs: Array<{ key: string; label: string; ariaLabel: string }> = [
  { key: "overview", label: "Overview", ariaLabel: "Project overview tab" },
  { key: "finance",  label: "Finance",  ariaLabel: "Project finance tab" },
  { key: "notes",    label: "Notes",    ariaLabel: "Project notes tab" },
  { key: "activity", label: "Activity", ariaLabel: "Project activity tab" },
];
```

And inside the tab `<Link>`:

```tsx
<Link
  key={t.key}
  href={`/projects/${detail.project.id}?tab=${t.key}`}
  aria-label={t.ariaLabel}
  aria-current={isActive ? "page" : undefined}
  className={`relative px-4 py-3 text-sm font-medium transition-colors ${
    isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
  }`}
>
  {t.label}
  {isActive && <span className="absolute bottom-0 left-0 right-0 h-px bg-accent" />}
</Link>
```

### What MUST NOT change

- Visible tab labels stay `Overview / Finance / Notes / Activity` (no copy change to the calm reading order).
- The `href` query string `?tab=finance` and the `tabQuery` parsing logic — Playwright selector `main a[href*="?tab=finance"]` and all route behaviour stay green.
- The active-tab underline span and outer tab-strip border.

### Responsiveness note

Adding `aria-label` is resolution- and breakpoint-independent. The visible layout is unchanged on all widths.

---

## 2. Project summary cards as one band (Tester #3, medium)

### Where to change

**File:** `app/(workspace)/projects/[projectId]/page.tsx`
**Current class string to locate:**

```tsx
<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  <MetricCard ... />   {/* Total Contract Value */}
  <MetricCard ... />   {/* Unpaid by Client — solid black spotlight, tone="accent" */}
  <MetricCard ... />   {/* Unpaid to Vendors — tone="warning" */}
  <MetricCard ... />   {/* Tax Still to Be Paid */}
</section>
```

### Replacement

Wrap the four cards in one rounded container with vertical dividers between cards. The `MetricCard` component is **not** modified. Only the grid wrapper and the per-cell padding change.

```tsx
<section
  aria-label="Project finance summary"
  className="overflow-hidden rounded-[4px] border border-border bg-surface"
>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
    <div className="border-b border-border p-5 md:border-b-0 md:border-r xl:border-b-0">
      <MetricCard
        label="Total Contract Value"
        value={formatCurrencyIdr(detail.financeSummary.contractValue.amount, { compact: true })}
        supportingText={detail.project.clientName}
        icon={Waypoints}
      />
    </div>
    <div className="border-b border-border p-5 md:border-b-0 md:border-r xl:border-b-0">
      <MetricCard
        label="Unpaid by Client"
        value={formatCurrencyIdr(detail.financeSummary.outstandingReceivable.amount, { compact: true })}
        supportingText="Open client invoices"
        icon={Landmark}
        tone="accent"
      />
    </div>
    <div className="border-b border-border p-5 md:border-b-0 md:border-r xl:border-b-0">
      <MetricCard
        label="Unpaid to Vendors"
        value={formatCurrencyIdr(detail.financeSummary.outstandingPayable.amount, { compact: true })}
        supportingText="Open vendor obligations"
        icon={WalletCards}
        tone="warning"
      />
    </div>
    <div className="p-5">
      <MetricCard
        label="Tax Still to Be Paid"
        value={formatCurrencyIdr(detail.financeSummary.unpaidTax.amount, { compact: true })}
        supportingText="Combined tax across invoices and vendor obligations"
        icon={Receipt}
      />
    </div>
  </div>
</section>
```

Notes:
- The wrapper itself uses `border border-border` (already in the codebase) and `bg-surface` (`--surface` token, already defined). The inner cells carry the same `border-border` divider — no new colour or shadow token introduced.
- `MetricCard` already renders its own internal padding (`p-6`). The wrapper cell's `p-5` means card surfaces sit flush against the dividers, which is what gives the band its single-section read.
- The spotlight card (second cell, `tone="accent"`) keeps its black surface, white text, and `shadow-[8px_8px_0_0_rgba(0,0,0,0.05)]` exactly as today. The container just frames it.

### What MUST NOT change

- Card labels, values, supporting text, icons, tones, and the spotlight black surface on `Unpaid by Client`.
- The `MetricCard` component itself (no edits to `components/ui/metric-card.tsx`).
- The order of the four cards.

### Responsiveness note

- `< md` (`grid-cols-1`): four rows stacked, dividers are horizontal `border-b` between rows, no right border.
- `md ≤ xl` (`md:grid-cols-2`): 2×2 grid; `md:border-b-0` clears the bottom border where rows end, `md:border-r` keeps the vertical divider between the two columns (except the rightmost cells).
- `≥ xl` (`xl:grid-cols-4`): single row of four; only `md:border-r` dividers remain between cells.

---

## 3. Dashboard "Recent Updates" placement (Tester #6, medium)

### Where to change

**File:** `app/(workspace)/dashboard/page.tsx`
**Current class string to locate:**

```tsx
<section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
  <SectionPanel title="Active Projects" ... />
  <SectionPanel title="Recent Updates" ... />
</section>
```

### Replacement

Promote the existing 2-column section into a true side-by-side at `xl:` widths. The Active Projects panel becomes the wider left column; Recent Updates becomes a fixed-width right column with a vertical sticky behaviour so the feed is visible without scrolling past the table on tall pages.

```tsx
<section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
  <SectionPanel title="Active Projects" description="Projects currently in progress">
    {/* unchanged table content */}
  </SectionPanel>

  <div className="xl:sticky xl:top-6 xl:self-start">
    <SectionPanel title="Recent Updates" description="The latest changes across your projects.">
      {/* unchanged Recent Updates content */}
    </SectionPanel>
  </div>
</section>
```

No change to what the feed renders or to the order of items — purely a layout reshuffle.

### What MUST NOT change

- The feed's data source (`snapshot.recentActivity`), item shape, badge, timestamp formatting, and empty-state path.
- The `<SectionPanel>` component itself.
- The Active Projects table content, columns, and row mapping.

### Responsiveness note

- `< xl`: a single column (`grid gap-6`); Recent Updates renders below Active Projects as today.
- `≥ xl`: two columns; the right column uses `xl:sticky xl:top-6 xl:self-start` so on tall tables the feed stays visible while the user scrolls the left column. The right column's `min-width: 280px` keeps the badge and timestamp legible at narrow desktop widths.

---

## 4. Filter / Apply / export "stair-step" (Tester #1, low)

### Where to change

#### A. `app/(workspace)/projects/page.tsx`

**Current class strings to locate (inside the `SectionPanel action`):**

```tsx
<div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
  <form className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_170px_170px_auto]">
    {/* search input + lifecycle select + health select + Apply */}
  </form>
  <div className="flex flex-wrap items-center justify-end gap-2">
    {/* Export XLSX / Export PDF / Export · CSV */}
  </div>
</div>
```

The stair-step happens because the inner grid `md:grid-cols-[minmax(220px,1fr)_170px_170px_auto]` overflows the available `flex-1` width when the export cluster reserves right-hand space, forcing cells onto multiple rows.

**Replacement:**

```tsx
<div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
  <form className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_170px_170px_auto]">
    {/* search input — keep h-11 */}
    {/* lifecycle select — h-11 */}
    {/* health select — h-11 */}
    {/* Apply — h-11 */}
  </form>
  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
    {/* Export XLSX (h-11, bg-black) / Export PDF (h-11, border-black bg-white) / Export · CSV (h-11, text-text-secondary) */}
  </div>
</div>
```

Key changes:
- Outer `md:` → `xl:` so on `md` and below the filter form takes the full width and stacks above the export cluster cleanly (no mid-width wrap that causes the stair-step).
- Inner grid starts at `grid-cols-1` (mobile: 1 column), goes to `sm:grid-cols-2` (two-up), then `xl:grid-cols-[minmax(0,1fr)_170px_170px_auto]` only at `xl:` where the export cluster has moved right and the form has full width to itself.
- `minmax(0,1fr)` (was `minmax(220px,1fr)`) lets the search input shrink to its container rather than forcing a 220 px floor that overflows.

#### B. `app/(workspace)/finance/page.tsx`

**Current class strings to locate (inside the `All Client Invoices` `SectionPanel action`):**

```tsx
<div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
  <form className="grid flex-1 gap-3 sm:grid-cols-[minmax(220px,1fr)_170px_auto]">
    {/* search + status select + Apply */}
  </form>
  <div className="flex flex-wrap items-center justify-end gap-2">
    {/* Export XLSX / Export PDF / Export · CSV */}
  </div>
</div>
```

**Replacement:**

```tsx
<div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
  <form className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_170px_auto]">
    {/* search input — h-11 */}
    {/* status select — h-11 */}
    {/* Apply — h-11 */}
  </form>
  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
    {/* Export XLSX / Export PDF / Export · CSV — all h-11 */}
  </div>
</div>
```

Same shape: outer `md:` → `xl:`, inner grid widens only at `xl:`, search `minmax(220px,1fr)` → `minmax(0,1fr)`.

### What MUST NOT change

- All three export routes stay reachable (`/api/export-projects*`, `/api/export-finance*`) and still produce CSV / XLSX / PDF.
- All `h-11` heights, button colours (`border-black bg-black` / `border-black bg-white` / `text-text-secondary`), and label text.
- The form's `name` attributes (`q`, `lifecycle`, `health`, `status`) — the URL contract and the Playwright selector chain for filter assertions stay intact.
- The `SectionPanel` and `PageHeader` components.

### Responsiveness note

- `< sm`: single column form, exports on their own row below. No stair-step; one row per element.
- `sm ≤ xl`: form is 2-column (`sm:grid-cols-2`), exports row below. ~40 px saved vs the old 3-stair pattern.
- `≥ xl`: form is one row (search + 2 selects + Apply on Projects; search + select + Apply on Finance), exports row right-aligned on the same strip — the intended single action surface. Total vertical footprint drops by the ~80 px the Tester measured.

---

## Guardrails (apply to all four items)

- No edits to `components/ui/*` (`section-panel`, `metric-card`, `status-badge`, `project-status-badge`, `page-header`, `avatar`) and no edits to `components/shell/app-sidebar.tsx` or `lib/navigation.ts` (the `Finance` sidebar label is intentionally unchanged per item #1).
- No new Tailwind tokens, no new colours, no new fonts, no new shadows.
- No changes to data sources, route handlers, or Playwright selector surface (`main a[href*="?tab=finance"]` etc. must continue to resolve).
- Tests `tests/unit/projects-search.test.ts` and `tests/unit/project-query-contract.test.ts` remain untouched and green.
- All snippets use only existing Tailwind classes already in the codebase: `h-11`, `border-border`, `bg-white`, `bg-black`, `bg-surface`, `bg-surface-muted`, `text-text-primary`, `text-text-secondary`, `text-accent`, `accent-strong`, `border-border-muted`, `rounded-[2px]`, `rounded-[4px]`, `p-5`, `p-6`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `xl:grid-cols-…`, `xl:flex-row`, `xl:items-center`, `xl:justify-between`, `xl:justify-end`, `xl:sticky`, `xl:top-6`, `xl:self-start`, `md:flex-row`, `md:items-center`, `md:justify-between`, `md:gap-6`, `sm:grid-cols-2`, `grid-cols-1`, `minmax(0,1fr)`, `flex-wrap`, `overflow-hidden`, `transition-colors`, `eyebrow`.