# D1 — Export De-clutter, Finance Header Efficiency, Sizing Pass

**Date:** 2026-08-27
**Scope:** `app/(workspace)/projects/page.tsx`, `app/(workspace)/finance/page.tsx`
**Constraints:** Keep theme, fonts, tokens. No new components except a tiny `ExportMenu` is acceptable. Keep all 3 formats (CSV / XLSX / PDF) reachable. Reuse Tailwind tokens already in the codebase.

---

## 1. Export Presentation — One Primary Pattern

**Recommendation: a compact grouped button row, placed inside the relevant `SectionPanel` toolbar (above the table), not in the page header.**

Three export buttons live where the filtered data lives, sit next to the filter form on the **same toolbar row**, and use a clear visual hierarchy:

- **XLSX** — primary (filled black), `h-11`, same height as Apply / Create.
- **PDF** — secondary (outlined, black border on white), `h-11`.
- **CSV** — quiet overflow option rendered as a tertiary text button `Export · CSV` next to PDF, `h-11`.

All three remain reachable. CSV is no louder than the others — it just loses the redundant "Export Projects" / "Export Finance" prefix and stops competing for button-bar real estate.

### Justification (2–3 sentences)

The page header should carry **only create / primary-record actions** (Design §8: "top page header" exists to anchor identity, not to host utility buttons). Exports are downstream of the *current filter set*, so they belong with the table, not with the page title. XLSX + PDF lead because they are the formats studios actually open in Excel / print for review; CSV stays as a quiet fallback for raw data, matching Design §4.C "restrained typography" and §10 "minimal".

### Layout placement

- **Projects page:** inside the existing `SectionPanel` `action` slot, *above the table*. Filter form on the left, exports cluster on the right, both `flex-wrap` so they stack on narrow screens.
- **Finance page:** inside the `All Client Invoices` `SectionPanel` `action` slot — same pattern, filter form left, exports cluster right.

---

## 2. Finance Header Efficiency

**Recommendation: keep only the two "Add" actions in `PageHeader.actions`. Move the three exports out of the header and into the invoices SectionPanel toolbar (per §1).**

The Finance page `PageHeader` then carries exactly two buttons:

1. `Add Invoice` — primary filled (`bg-black`, white text), `h-11`.
2. `Add Vendor Obligation` — secondary outlined (`border border-black bg-white`, black text), `h-11`.

Exports disappear from the header entirely. The five-button header becomes a two-button header; exports are reachable in one click via the invoices SectionPanel toolbar, exactly where the user is already looking at the data they want to export.

No new routes, no new vocabulary — labels are unchanged.

---

## 3. Sizing & Spacing Consistency

### Standardise control heights

| Tier            | Height | When to use                                                       |
|-----------------|--------|--------------------------------------------------------------------|
| Primary         | `h-11` | Create / Add / Apply buttons, search and filter inputs             |
| Secondary       | `h-11` | Outlined actions (Add Vendor, Export PDF, Export XLSX when not primary) |
| Tertiary / text | `h-11` | Quiet overflow (`Export · CSV`) — same height, no border, hover-only underline |

**Rule: every interactive control on these two pages is `h-11`.** The current `h-10` export buttons are the only outliers and become `h-11` to match.

### Spacing tokens (already in use, no new tokens)

- Inter-button gap: `gap-2` (8 px) inside the export cluster, `gap-3` (12 px) between header actions.
- Cluster ↔ form gap inside the SectionPanel toolbar: `gap-4` on wide screens, vertical on narrow.

### Wrap behaviour on narrow screens

The SectionPanel action container becomes:

```tsx
<div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
  {/* filter form on the left */}
  {/* exports cluster on the right */}
</div>
```

Filter form uses `flex-1 min-w-0` on its widest input so it can shrink; exports cluster uses `flex-wrap gap-2` and stays right-aligned via `md:justify-end` if alone in its row.

### Exact Tailwind classes for export buttons

- **XLSX (primary export):**
  `inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong`
- **PDF (secondary export):**
  `inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted`
- **CSV (quiet overflow, text button):**
  `inline-flex h-11 items-center px-2 text-sm font-medium text-text-secondary underline-offset-4 hover:text-accent hover:underline`

---

## 4. File-Level Diffs (snippets, copy-pasteable)

### A. `app/(workspace)/projects/page.tsx`

**Replace the entire `SectionPanel action={…}` block** (currently the form + the three `h-10` export buttons crammed into one horizontal row) with a two-zone toolbar:

Current (abridged):
```tsx
action={
  <div className="flex items-center gap-3">
    <form className="grid gap-3 md:grid-cols-[...]">
      {/* search + lifecycle select + health select + Apply (all h-11) */}
    </form>
    <div className="flex items-center gap-2">
      <a href="/api/export-projects"      className="... h-10 ...">Export Projects</a>
      <a href="/api/export-projects-xlsx" className="... h-10 ...">Export XLSX</a>
      <a href="/api/export-projects-pdf"  className="... h-10 ...">Export PDF</a>
    </div>
  </div>
}
```

Proposed:
```tsx
action={
  <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
    <form className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_170px_170px_auto]">
      {/* search + lifecycle select + health select + Apply (all h-11, unchanged) */}
    </form>
    <div className="flex flex-wrap items-center justify-end gap-2">
      <a href="/api/export-projects-xlsx"
         className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong">
        Export XLSX
      </a>
      <a href="/api/export-projects-pdf"
         className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted">
        Export PDF
      </a>
      <a href="/api/export-projects"
         className="inline-flex h-11 items-center px-2 text-sm font-medium text-text-secondary underline-offset-4 hover:text-accent hover:underline">
        Export · CSV
      </a>
    </div>
  </div>
}
```

### B. `app/(workspace)/finance/page.tsx`

**Replace `PageHeader actions={…}`** (currently 5 buttons) with only the two Add actions:

Current:
```tsx
actions={
  <>
    <Link href="/finance/invoices/new"          className="... h-11 bg-black ...">Add Invoice</Link>
    <Link href="/finance/vendor-obligations/new" className="... h-11 border-black bg-white ...">Add Vendor Obligation</Link>
    <a href="/api/export-finance"      className="... h-10 ...">Export Finance</a>
    <a href="/api/export-finance-xlsx" className="... h-10 ...">Export XLSX</a>
    <a href="/api/export-finance-pdf"  className="... h-10 ...">Export PDF</a>
  </>
}
```

Proposed:
```tsx
actions={
  <>
    <Link href="/finance/invoices/new"
          className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong">
      Add Invoice
    </Link>
    <Link href="/finance/vendor-obligations/new"
          className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted">
      Add Vendor Obligation
    </Link>
  </>
}
```

**Add the same export cluster to the `All Client Invoices` SectionPanel `action={…}`** (currently the form alone), placed in the same two-zone toolbar as Projects:

Proposed (append a sibling cluster next to the existing form):
```tsx
action={
  <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
    <form className="grid flex-1 gap-3 sm:grid-cols-[minmax(220px,1fr)_170px_auto]">
      {/* existing search + status select + Apply (all h-11, unchanged) */}
    </form>
    <div className="flex flex-wrap items-center justify-end gap-2">
      <a href="/api/export-finance-xlsx"
         className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong">
        Export XLSX
      </a>
      <a href="/api/export-finance-pdf"
         className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted">
        Export PDF
      </a>
      <a href="/api/export-finance"
         className="inline-flex h-11 items-center px-2 text-sm font-medium text-text-secondary underline-offset-4 hover:text-accent hover:underline">
        Export · CSV
      </a>
    </div>
  </div>
}
```

The `Invoices Needing Follow-up` and `Open Vendor Obligations` panels keep no actions.

---

## Guardrails

- No new colours, fonts, or spacing tokens — only classes already in the codebase (`h-11`, `border-border`, `bg-black`, `bg-white`, `bg-surface-muted`, `text-text-secondary`, `text-accent`, `accent-strong`).
- All three export routes remain reachable (`/api/export-projects*`, `/api/export-finance*`).
- No new components. If a dropdown variant is later preferred, a 30-line `ExportMenu` is the only acceptable addition; not needed for this pass.
- No copy that conflicts with `docs/controlled-vocabulary.md` — labels remain `Export XLSX`, `Export PDF`, `Export · CSV`, `Add Invoice`, `Add Vendor Obligation`.
- No edits to `SectionPanel`, `PageHeader`, `MetricCard`, `StatusBadge`, or any other reusable component.