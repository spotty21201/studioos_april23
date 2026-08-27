import { describe, it, expect } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ProjectsPdfDocument } from "@/lib/pdf/build-projects-pdf";
import { FinancePdfDocument } from "@/lib/pdf/build-finance-pdf";
import {
  formatProjectsPdfFilename,
  formatFinancePdfFilename,
} from "@/lib/pdf/format";

// We test the PDF Documents directly via `renderToBuffer` rather than
// spinning up a Next.js route handler, which keeps the test framework-free
// (no need to mock `next/server`, the Supabase server client, or env vars).
// The route handlers above just glue these Documents to a GET endpoint
// using the same data-loading functions the XLSX routes already use, so
// validating the buffer shape is the meaningful assertion.

const SAMPLE_PROJECTS = [
  [
    "HDA-26001",
    "Lippo Pekanbaru 36 ha",
    "Lippo Group",
    "Active",
    "Needs a closer look",
    "Pekanbaru, Riau",
    "2026-01-12",
    "2026-07-10",
    "125,000,000",
    "Doddy Samiaji",
    "Maya Puspa",
    "2026-04-22T02:10:00.000Z",
  ],
  [
    "HDA-26002",
    "Lippo Puncak 18 ha",
    "Lippo Group",
    "Active",
    "On track",
    "Puncak, Jawa Barat",
    "2026-01-05",
    "2026-06-02",
    "85,000,000",
    "Dodi Supriyatna",
    "Indri Ramadhani",
    "2026-04-21T08:30:00.000Z",
  ],
];

const SAMPLE_INVOICES = [
  [
    "Lippo Pekanbaru 36 ha",
    "INV-26001",
    "Master Plan Concept Milestone",
    "2026-03-28",
    "2026-04-12",
    "",
    "40,000,000",
    "11%",
    "4,400,000",
    "Overdue",
  ],
  [
    "Lippo Puncak 18 ha",
    "INV-26002",
    "Resort Layout Approval Stage",
    "2026-04-01",
    "2026-04-25",
    "2026-04-20",
    "30,000,000",
    "11%",
    "3,300,000",
    "Paid",
  ],
];

describe("PDF export — projects", () => {
  it("renders to a PDF buffer with %PDF- magic bytes and reasonable size", async () => {
    const doc = createElement(ProjectsPdfDocument, { rows: SAMPLE_PROJECTS });
    const buffer = await renderToBuffer(doc as unknown as Parameters<typeof renderToBuffer>[0]);
    // Header for a PDF document is always "%PDF-" (5 bytes).
    const head = buffer.slice(0, 5).toString("ascii");
    expect(head).toBe("%PDF-");
    // A rendered PDF with header + 2 data rows must be larger than 1 KB.
    expect(buffer.length).toBeGreaterThan(1024);
  });

  it("renders zero rows without throwing and still emits valid PDF", async () => {
    const doc = createElement(ProjectsPdfDocument, { rows: [] });
    const buffer = await renderToBuffer(doc as unknown as Parameters<typeof renderToBuffer>[0]);
    const head = buffer.slice(0, 5).toString("ascii");
    expect(head).toBe("%PDF-");
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("uses the standard filename pattern for downloads", () => {
    const filename = formatProjectsPdfFilename();
    expect(filename).toMatch(/^studioos-projects-\d{4}-\d{2}-\d{2}\.pdf$/);
  });
});

describe("PDF export — finance", () => {
  it("renders to a PDF buffer with %PDF- magic bytes and reasonable size", async () => {
    const doc = createElement(FinancePdfDocument, { rows: SAMPLE_INVOICES });
    const buffer = await renderToBuffer(doc as unknown as Parameters<typeof renderToBuffer>[0]);
    const head = buffer.slice(0, 5).toString("ascii");
    expect(head).toBe("%PDF-");
    expect(buffer.length).toBeGreaterThan(1024);
  });

  it("uses the standard filename pattern for downloads", () => {
    const filename = formatFinancePdfFilename();
    expect(filename).toMatch(/^studioos-finance-\d{4}-\d{2}-\d{2}\.pdf$/);
  });
});