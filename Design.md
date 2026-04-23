# AIM StudioOS — Web UI Direction

## Product
**AIM StudioOS**

**Subtitle:** The operating system and dashboard for AIM.

## Purpose
AIM StudioOS is a **Principal-facing internal dashboard** for a design, architecture, and planning studio.

V1 is **not** an ERP, not a workflow management tool, and not a dense back-office system. Its purpose is to give studio leadership a fast, structured executive view of:
- active projects
- project health
- finance summaries
- unpaid items
- document completeness
- key notes
- recent activity

The product should feel like an **executive briefing interface**: clear, calm, premium, and low-friction.

---

## 1. Design Positioning

### Core Character
The UI should feel like:
- **architectural rather than corporate software**
- **premium but restrained**
- **minimal without feeling empty**
- **analytical without looking financial-heavy**
- **quietly modern, not trendy**

### Experience Principles
- **Calm first** — reduce visual noise and avoid dashboard chaos.
- **Executive readability** — every screen should answer “what matters now?” quickly.
- **Structured hierarchy** — strong information architecture, light chrome.
- **Table-first where clarity matters** — use tables for projects, invoices, documents, and obligations.
- **Cards for top-level summaries only** — cards should summarize, not fragment the interface.
- **Briefing-page mindset** — especially on Project Detail, the experience should read like an internal board memo.

### Explicitly Avoid
- ERP-style visual density
- saturated colors and loud alerts everywhere
- complex form-heavy surfaces
- admin clutter and deep operations tooling
- team workflow mechanics, timesheets, and task management

---

## 2. Recommended Visual Language

This product should combine:
- **Notion-like warmth and restraint** for whitespace, softness, and calm reading
- **Stripe-like precision** for hierarchy, finance presentation, and premium light-theme polish

### Overall Mood
- light background
- soft borders
- subtle elevation
- precise typography
- measured spacing
- minimal icon usage
- almost no decorative graphics

### Color Direction
Use a restrained, light architectural palette.

**Foundation**
- Background: `#F7F6F3`
- Surface: `#FFFFFF`
- Alt surface: `#F1EFEA`
- Primary text: `#1F2428`
- Secondary text: `#68707A`
- Tertiary text: `#98A0A8`
- Border: `#E4E7EB`

**Accents**
- Primary accent: `#2F5E7A` (muted architectural blue)
- Positive: `#3D7A57`
- Warning: `#B07A2A`
- Critical: `#A65A4D`
- Info tint: `#EEF4F8`
- Warning tint: `#FBF5EA`
- Critical tint: `#F8EEEC`
- Positive tint: `#EEF5F0`

### Color Usage Rules
- Keep most of the interface neutral.
- Use accent colors mainly for status, emphasis, and links.
- Avoid bright dashboard colors competing at once.
- Use tinted backgrounds instead of hard fills for alerts and status chips.

### Typography Direction
Use a clean, modern sans serif such as **Inter**, **Suisse Int’l**, **Neue Haas Grotesk**, or equivalent.

**Suggested hierarchy**
- Page title: 28–32px / 600
- Section title: 18–20px / 600
- Card metric: 28–36px / 600
- Table header: 12–13px / 600 / uppercase or tracked small caps
- Body: 14–15px / 400
- Metadata: 12–13px / 400–500

Typography should feel:
- crisp
- quiet
- editorial
- high-legibility

### Radius / Borders / Shadows
- Border radius: 10–14px for cards and panels
- Inputs and pills: 8–10px
- Borders: 1px soft neutral
- Shadows: subtle, low-contrast, used sparingly

Preferred depth model:
- most surfaces rely on **border + contrast**, not heavy shadows
- summary cards can have a faint ambient shadow
- tables should feel flat and precise

---

## 3. Layout System

### Shell
Use a consistent app shell:
- **Left sidebar navigation**
- **Top contextual bar** for page title, date range, filters, and search where relevant
- **Main content canvas** centered within generous margins

### Sidebar
Navigation items:
1. Dashboard
2. Projects
3. Finance
4. Documents
5. Notes & Activity
6. Settings

Sidebar design:
- narrow, elegant, light-toned panel
- subtle active indicator
- monochrome icons or no icons
- brand/title at top: **AIM StudioOS**
- optional small subtitle beneath: *Operating system and dashboard for AIM*

### Content Width
- Use a max-width content frame around `1280–1440px`
- Preserve breathing room on large screens
- Avoid full-bleed dense tables unless necessary

### Core Spacing Rhythm
- 24px between major sections
- 16px between sub-sections
- 12px between related items inside cards/panels
- 32px page top/bottom padding

---

## 4. Reusable UI Patterns

## A. Summary Metric Cards
Use for high-level financial and operational summaries only.

**Pattern**
- label
- primary number/value
- short contextual comparison or note
- optional subtle trend marker

**Examples**
- Contract Value
- Invoiced
- Paid
- Receivables
- Payables
- Active Projects
- Needs Attention

**Design**
- white card surface
- restrained typography
- one key number only
- tiny status line below
- no mini-charts in V1 unless extremely subtle

## B. Attention Panels
Use for action-needed overview blocks.

Examples:
- Overdue invoices
- Unpaid vendor obligations
- Missing documents
- Projects needing attention

**Design**
- structured list panel
- left-aligned content
- optional severity chip
- top-right “View all” link
- max 5–7 items in dashboard preview

## C. Data Tables
Primary pattern for operational clarity.

Use for:
- Projects List
- invoice status
- payables
- document completeness
- activity log entries

**Table behavior**
- clear headers
- moderate row height
- sticky header if long
- zebra striping optional but very subtle
- sorting/filtering minimal and clean
- badges for status
- right-aligned numeric columns

## D. Section Panel
A reusable bordered container with:
- section title
- optional action on right
- content block below

Use repeatedly in Project Detail, Finance, Documents, Notes.

## E. Status Chips
Status should be readable but quiet.

**Project statuses**
- Active
- At Risk
- On Hold
- Completed
- Closing

**Document statuses**
- Complete
- Missing
- Partial
- Pending Review

**Finance statuses**
- Current
- Overdue
- Partially Paid
- Unpaid

Use tinted chips with muted text, not bright solid badges.

---

## 5. Screen-by-Screen Direction

## 5.1 Principal Dashboard
### Objective
Provide the principal with an immediate understanding of studio health and what needs attention today.

### Layout
Use a modular vertical flow:
1. Page header
2. top summary cards row
3. attention row
4. recent intelligence row
5. recent activity row

### Header Content
- Title: `Principal Dashboard`
- subtitle or timestamp: `Studio snapshot as of today`
- optional date filter on right

### Main Dashboard Sections

#### 1. Summary Cards
Five to seven cards max:
- Active Projects
- Contract Value
- Invoiced
- Paid
- Receivables
- Payables
- Needs Attention

Cards should be compact and elegant, arranged in one row or responsive two-row grid.

#### 2. Attention Panels
A row of 2–4 focused panels:
- Projects Needing Attention
- Overdue Invoices
- Unpaid Vendor Obligations
- Missing Documents

Each panel should show:
- item title
- project/client reference
- amount or missing item count where relevant
- age / due date / severity

#### 3. Recent Notes
A compact preview panel with:
- latest note title or first line
- project reference
- author if needed
- timestamp

#### 4. Recent Activity
A clean chronological list with concise events such as:
- invoice issued
- payment received
- document uploaded
- note added
- project status changed

### Dashboard Tone
This page should feel like a **quiet command center** — not a BI dashboard.

---

## 5.2 Projects List
### Objective
Give the principal a clear scan of all active and relevant projects.

### Primary Pattern
A table-first screen.

### Header Area
- Title: `Projects`
- tabs or segmented control: `Active`, `All`, `Needs Attention`, `Closing`
- search field
- filter controls: status, client, manager

### Table Columns
Recommended columns:
- Project Name
- Client
- Status
- Manager
- Contract Value
- Invoiced
- Paid
- Receivables
- Key Date / Contract Period
- Documents
- Last Activity

### Supporting Features
- row click opens Project Detail
- muted status chips
- missing-doc indicator
- overdue receivable indicator
- optional pinned projects at top

### Secondary Pattern
A very light summary strip above the table:
- Active count
- At-risk count
- Total contract value
- Total receivables

### Visual Tone
This should feel like a refined portfolio operations list, not a CRM.

---

## 5.3 Project Detail
### Objective
Create an executive briefing page for a single project.

This is the most important screen in the product.

### Overall Layout
Recommended structure:
1. project header
2. executive summary card row
3. finance section
4. documents section
5. notes section
6. activity log

### Project Header
Include:
- Project Name
- Client
- Status chip
- Manager
- Contract Period
- optional project code

On the right, a compact action cluster:
- Add Note
- View Documents
- Open Finance

### Executive Summary Cards
Show the most important project-level metrics:
- Contract Value
- Invoiced
- Paid
- Outstanding Receivables
- Vendor Payables
- Document Completeness

### Finance Section
A structured panel containing:
- contract summary
- invoices issued
- payments received
- receivables aging or overdue amount
- vendor obligations/payables summary

Use compact summary cards at top of the section, followed by a clean table if needed.

### Documents Section
Show document completeness as an executive checklist.

Possible pattern:
- required document categories list
- each row with status: complete / missing / partial
- last updated date
- upload/view count

The emphasis should be on **completeness and risk visibility**, not file management complexity.

### Notes Section
Notes should read like strategic annotations, not chat.

Display:
- note title or first line
- author
- project relevance tag
- created date
- pinned / key note marker if relevant

### Activity Log
A clean chronological feed with compact rows:
- timestamp
- event type
- summary text

### Tone
This page should feel like a partner meeting brief or executive dossier.

Do not make it look like a form.

---

## 5.4 Finance Overview
### Objective
Provide studio-level financial visibility without becoming accounting software.

### Layout
1. financial summary cards
2. receivables panel/table
3. payables panel/table
4. invoice overview
5. simple trend or monthly summary area

### Summary Cards
- Contract Value
- Invoiced
- Paid
- Receivables
- Overdue Invoices
- Payables

### Core Sections

#### Receivables
Table columns:
- Project
- Client
- Invoice Ref
- Due Date
- Amount
- Status
- Days Overdue

#### Payables
Table columns:
- Project
- Vendor
- Obligation Type
- Due Date
- Amount
- Status

#### Invoice Overview
Could include:
- current month issued
- current month paid
- outstanding total
- overdue total

### Optional Visualization
If charts are used, keep them sparse:
- one understated line or bar trend
- no colorful analytics dashboard language

### Tone
Finance should feel **clear and executive**, not accountant-heavy.

---

## 5.5 Documents
### Objective
Show completeness, missing items, and document health across projects.

### Primary Pattern
Table + status overview.

### Top Area
- summary cards: Complete, Partial, Missing, Needs Review
- filter by project / document type / status

### Main Table Columns
- Project
- Document Category
- Required
- Available
- Status
- Last Updated
- Notes / Flag

### Secondary View
Optionally allow grouped-by-project accordion sections for quick scanning.

### Tone
This is not a DMS in V1.
It is a **document completeness dashboard**.

---

## 5.6 Notes / Activity
### Objective
Provide a lightweight internal intelligence layer for leadership memory and situational awareness.

### Recommended Structure
Two-column layout:
- left: Notes
- right: Activity

Or segmented tabs if cleaner.

### Notes
Show:
- note title or summary
- project link
- author
- date
- pinned flag
- short excerpt

Allow filtering by:
- project
- note type
- recent / pinned

### Activity
Show concise system events:
- invoice sent
- payment received
- document uploaded
- status updated
- note created

### Tone
Notes should feel editorial and durable.
Activity should feel factual and lightweight.

---

## 5.7 Settings
### Objective
Minimal, principal-level configuration only.

### Include in V1
- profile basics
- notification preferences
- dashboard display preferences
- status definitions or labels if needed
- finance/document view defaults

### Exclude in V1
- organization complexity
- multi-studio permissions matrix
- accounting configuration depth
- workflow engine settings

### Tone
Simple and low-frequency.

---

## 6. Information Hierarchy Rules

### Priority Order Across the Product
1. what needs attention
2. financial status
3. project status
4. missing documentation
5. notes and recent changes

### Content Rules
- show only the most decision-relevant information by default
- progressive disclosure for secondary detail
- prefer concise labels over long descriptions
- every panel should justify its presence

### Density Rules
- dashboards: medium-light density
- lists/tables: medium density
- detail pages: mixed density, with stronger sectioning

---

## 7. Interaction Principles

### Navigation
- stable left navigation
- minimal mode switching
- predictable layout from screen to screen

### Filtering
- keep filters lightweight and contextual
- avoid advanced filter-builder UX in V1

### Search
- allow direct search for projects, clients, invoices, or documents
- keep placement consistent in list-style screens

### Empty States
Empty states should be elegant and reassuring.
Examples:
- `No overdue invoices.`
- `All required documents are complete.`
- `No recent notes for this period.`

### Alerts
Use alerts sparingly.
Prefer:
- status chips
- attention panels
- soft tinted rows
rather than banners everywhere.

---

## 8. Suggested Component Inventory

Build a small, reusable system:
- app shell
- sidebar nav
- top page header
- summary metric card
- section panel
- data table
- status chip
- attention list
- timeline row
- note card
- filter bar
- empty state block

This product should feel consistent because the same few patterns repeat well.

---

## 9. V1 Product Framing

AIM StudioOS V1 is:
- a principal dashboard
- a studio visibility layer
- a structured executive interface
- a portfolio and finance health view

AIM StudioOS V1 is not:
- an ERP
- a task manager
- a team operations platform
- a full accounting platform
- an admin-heavy studio system

---

## 10. Final UI Direction Summary

Design AIM StudioOS as a **light, premium, executive dashboard for studio leadership**.

The design should feel:
- calm
- architectural
- precise
- minimal
- table-led where needed
- card-led only at summary level
- highly legible
- operationally serious without looking bureaucratic

If the interface feels like a hybrid of:
- an architecture studio briefing deck,
- a premium modern finance dashboard,
- and a restrained internal command center,

then the direction is correct.
