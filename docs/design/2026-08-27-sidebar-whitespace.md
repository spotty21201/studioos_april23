# D2 — Sidebar Whitespace Surgical Pass

**Date:** 2026-08-27
**User feedback:** *"too much air, make it a little bit (just a little bit I mean) more efficient. Particularly on the left sidebar, I felt it is too wide."*
**Constraint:** "just a little bit" — subtle whitespace/width trim, **not a redesign**. Keep theme, colors, PT Sans font, every nav item, and the bottom user card content visible. No shared component semantics change.

---

## Before inspection

### Measurement (live, Playwright Chromium headless, both viewports)

| Viewport | Sidebar width | Main column width | Main top padding | Bottom user-card height | Studio-block margin-bottom |
|---|---|---|---|---|---|
| **1440 × 900** | **288 px** (`w-72`) | 1152 px (x=288) | 32 px (`py-8`) | 217 px | 40 px (`mb-10`) |
| **1024 × 768** | **288 px** (`w-72`) | 736 px (x=288) | 32 px (`py-8`) | 217 px | 40 px (`mb-10`) |

Sidebar `aside` DOM class string at time of inspection:

```
hidden w-72 shrink-0 border-r border-border-strong bg-white px-5 py-6 lg:flex lg:flex-col
```

Sidebar `<nav>` items use `px-4 py-3` with `space-y-1.5`. The bottom user card carries the helper callout "Focus on what your projects need today — risks, decisions, and follow-ups." inside `px-4 py-4`.

### Where the air lives (qualitative)

- **Sidebar width 288 px** is the biggest single reclaim target: at 1440 the main column loses 288 px permanently; at 1024 the sidebar still consumes 288 px of a 1024 px viewport (≈ 28 %), which compresses the main column to 736 px and noticeably crowds the 5-card dashboard row.
- **Studio-name → nav gap = 40 px** (`mb-10`). Reads as deliberate breathing room; the user has flagged it as part of "too much air".
- **Nav row height `py-3` (24 px total)** — comfortable but slightly tall for a 4-item list.
- **Main `py-8` (32 px top)** — a touch airy at the top of every page.

### Before screenshots (Playwright Chromium headless)

- `/tmp/d2-before-1440-_dashboard.png` (1440 × 900)
- `/tmp/d2-before-1440-_projects.png` (1440 × 900)
- `/tmp/d2-before-1440-_finance.png` (1440 × 900)
- `/tmp/d2-before-1440-project_detail.png` (1440 × 900)
- `/tmp/d2-before-1024-_dashboard.png` (1024 × 768)
- `/tmp/d2-before-1024-_projects.png` (1024 × 768)
- `/tmp/d2-before-1024-_finance.png` (1024 × 768)
- `/tmp/d2-before-1024-project_detail.png` (1024 × 768)
- Findings log: `/tmp/d2-findings.txt`

---

## Recommended changes (4 surgical items)

### Change 1 — Narrow the sidebar one step (288 → 256)

- **File:** `components/shell/app-sidebar.tsx`
- **Find:** `<aside className="hidden w-72 shrink-0 border-r border-border-strong bg-white px-5 py-6 lg:flex lg:flex-col">`
- **Replace with:** `<aside className="hidden w-64 shrink-0 border-r border-border-strong bg-white px-4 py-6 lg:flex lg:flex-col">`
- **What changes:** `w-72` → `w-64` (288 → 256 px), `px-5` → `px-4` (20 → 16 px) so the inner content does not feel cramped against the narrower shell.
- **Rationale (one line):** Reclaims 32 px of horizontal real estate on every authenticated page while staying well above the visual minimum for a 4-item icon+label nav.
- **NOT removed/hidden:** Every nav item (`Dashboard / Projects / Finance / Settings`), the studio-name block, the user card, the Sign-out button, the focus-callout, and the active-state black background all remain.
- **Responsiveness:** No effect — `w-64` is unconditional. Below `lg:` (1024 px) the sidebar remains `hidden` (mobile nav takes over).

### Change 2 — Trim the studio-name block's bottom gap

- **File:** `components/shell/app-sidebar.tsx`
- **Find:** `<div className="mb-10 px-2">`
- **Replace with:** `<div className="mb-6 px-2">`
- **What changes:** `mb-10` → `mb-6` (40 → 24 px).
- **Rationale (one line):** Closes the most visible vertical air-pocket in the sidebar without crowding the studio heading against the nav.
- **NOT removed/hidden:** The studio name (`HDA StudioOS`) and the subtitle line remain; only the trailing gap shrinks.

### Change 3 — Trim nav-item vertical padding

- **File:** `components/shell/app-sidebar.tsx`
- **Find:** `className={`group flex items-center justify-between rounded-[2px] px-4 py-3 ${`  (inside the `<Link>` returned by `navigationItems.map`)
- **Replace with:** `className={`group flex items-center justify-between rounded-[2px] px-4 py-2.5 ${`
- **What changes:** `py-3` → `py-2.5` (12 → 10 px each side, total 24 → 20 px per row). For a 4-item list this recovers 16 px of vertical air.
- **Rationale (one line):** Subtle per-row trim that reads as the same nav, just a touch denser; matches the user's "just a little bit" register.
- **NOT removed/hidden:** Every link, icon, label, the active-state `bg-black text-white`, and the right-side `ChevronRight` affordance stay exactly as today.
- **Responsiveness:** Nav remains rendered only at `lg:` and above (sidebar `hidden` below 1024 px). No breakpoint change.

### Change 4 — Tighten the bottom user-card padding

- **File:** `components/shell/app-sidebar.tsx`
- **Find:** `<div className="mt-auto rounded-[4px] border border-border bg-surface-muted px-4 py-4">`
- **Replace with:** `<div className="mt-auto rounded-[4px] border border-border bg-surface-muted px-4 py-3">`
- **What changes:** `py-4` → `py-3` (16 → 12 px each side). Card height drops from 217 px to ~205 px.
- **Rationale (one line):** The card already has comfortable internal structure (avatar row + focus callout + sign-out); `py-3` is still generous for the helper copy.
- **NOT removed/hidden:** The avatar, name, role, the `Focus on what your projects need today — risks, decisions, and follow-ups.` callout, and the Sign-out button are all retained. **The decorative focus callout is kept** — it is a deliberate leadership-tone reminder, not decorative air.

### Optional Change 5 — Reduce main content top padding by one step

- **File:** `app/(workspace)/layout.tsx`
- **Find:** `<main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">`
- **Replace with:** `<main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-7">`
- **What changes:** `lg:py-8` → `lg:py-7` (32 → 28 px top/bottom at `lg:` and above).
- **Rationale (one line):** Saves 4 px top and 4 px bottom without changing the calm feel of the page top — only recommended if change 1 alone does not feel like enough trim.
- **NOT removed/hidden:** All page content, the optional `<DataSourceNotice>`, and the `max-w-[1440px]` centering rule stay identical.
- **Responsiveness:** Only applies at `lg:` (≥ 1024 px) and above; below `lg:` padding is unchanged at `py-6`.

---

## What is explicitly NOT changing

- **Theme, colors, fonts, typography sizes** (PT Sans body, eyebrow caps, mono caps, black accent).
- **Sidebar contents:** all 4 nav items, icons, labels, routes, active-state styling, Sign-out button, focus callout.
- **Sidebar vertical structure:** outer `lg:flex lg:flex-col`, `mt-auto` user card pinning, `border-r border-border-strong`.
- **Mobile navigation** (`<MobileNav />` in `app/(workspace)/layout.tsx`) and the topbar.
- **Right-side content widths / centering:** main `mx-auto max-w-[1440px]` and horizontal padding.
- **Any logic, route, link target, or data fetch.**

---

## Net effect estimate

| Change                                | Horizontal reclaim (1440) | Horizontal reclaim (1024) | Vertical reclaim (per page) |
|---------------------------------------|---------------------------|---------------------------|------------------------------|
| 1. `w-72 → w-64`, `px-5 → px-4`       | **+32 px main**           | **+32 px main**           | —                            |
| 2. `mb-10 → mb-6` (studio block)      | —                         | —                         | 16 px (sidebar only)         |
| 3. `py-3 → py-2.5` (nav rows)         | —                         | —                         | 16 px (sidebar only)         |
| 4. `py-4 → py-3` (user card)          | —                         | —                         | ~12 px (sidebar only)        |
| 5. `lg:py-8 → lg:py-7` (main, opt.)   | —                         | —                         | 8 px (main, only at lg+)     |

At 1440: **+32 px wider main column**, ~44 px less vertical air in the sidebar, optional 8 px less top air on the main page.
At 1024: **+32 px wider main column** (768 px usable), same sidebar vertical savings.

The user's "just a little bit" target — met by **Change 1 alone**; Changes 2–4 stack on it for the sidebar's vertical air; Change 5 is opt-in.

---

## Implementation notes for the Coder

- All edits are in two files: `components/shell/app-sidebar.tsx` and (optionally) `app/(workspace)/layout.tsx`. No new files, no new dependencies, no token changes.
- No other file needs to change for these to apply. The `navigationItems` constant in `lib/navigation.ts` is untouched; nav labels and routes are unchanged.
- After the change, re-screenshot at 1440 and 1024 to confirm the 32 px main-column reclaim is visible and the sidebar's `mt-auto` user card still pins to the bottom of the aside.
- Test files (`tests/unit/projects-search.test.ts`, `tests/unit/project-query-contract.test.ts`, etc.) are unaffected — no data-layer or route changes.