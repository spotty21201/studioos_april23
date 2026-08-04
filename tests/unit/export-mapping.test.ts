import { describe, it, expect } from "vitest";
import {
  humanizeStatus,
  mapProjectExportRow,
  mapInvoiceExportRow,
  formatTaxPercent,
  formatExportCurrency,
  PROJECT_EXPORT_HEADERS,
  FINANCE_EXPORT_HEADERS,
} from "@/lib/export/export-helpers";

describe("Export data mapping", () => {
  it("preserves client, owner, lead, and last-updated values", () => {
    const row = mapProjectExportRow({
      project_code: "HDA-26001",
      name: "Lippo Pekanbaru 36 ha",
      client_name: "Lippo Group",
      lifecycle_status: "active",
      health_status: "watch",
      location: "Pekanbaru, Riau",
      start_date: "2026-01-12",
      target_end_date: "2026-07-10",
      contract_value: 125000000,
      project_owner_name: "Doddy Samiaji",
      project_lead_name: "Maya Puspa",
      updated_at: "2026-04-22T02:10:00.000Z",
    });

    expect(row[0]).toBe("HDA-26001");
    expect(row[1]).toBe("Lippo Pekanbaru 36 ha");
    expect(row[2]).toBe("Lippo Group"); // Client
    expect(row[3]).toBe("Active"); // Stage humanized
    expect(row[4]).toBe("Needs a closer look"); // Health humanized
    expect(row[8]).toBe("125,000,000"); // Contract value
    expect(row[9]).toBe("Doddy Samiaji"); // Project owner
    expect(row[10]).toBe("Maya Puspa"); // Project lead
    expect(row[11]).toBe("2026-04-22T02:10:00.000Z"); // Last updated
  });

  it("humanizes lifecycle and health statuses", () => {
    expect(humanizeStatus("active")).toBe("Active");
    expect(humanizeStatus("on_hold")).toBe("On hold");
    expect(humanizeStatus("completed")).toBe("Completed");
    expect(humanizeStatus("on_track")).toBe("On track");
    expect(humanizeStatus("at_risk")).toBe("Action needed");
    expect(humanizeStatus("overdue")).toBe("Overdue");
    expect(humanizeStatus("issued")).toBe("Issued");
  });

  it("tax percentage formatting is consistent", () => {
    // Both CSV and XLSX go through this shared formatter, so they are identical.
    expect(formatTaxPercent(11)).toBe("11%");
    expect(formatTaxPercent(0)).toBe("0%");
    expect(formatTaxPercent(undefined)).toBe("0%");
    expect(formatTaxPercent(null)).toBe("0%");
  });

  it("currency formatting is consistent", () => {
    expect(formatExportCurrency(40000000)).toBe("40,000,000");
    expect(formatExportCurrency(0)).toBe("0");
    expect(formatExportCurrency(undefined)).toBe("0");
  });

  it("finance rows carry consistent tax percentage and humanized status", () => {
    const row = mapInvoiceExportRow({
      project_name: "Lippo Pekanbaru 36 ha",
      invoice_number: "INV-26001",
      title: "Master Plan Concept Milestone",
      issued_date: "2026-03-28",
      due_date: "2026-04-12",
      paid_at: "",
      invoice_amount: 40000000,
      tax_percentage: 11,
      tax_amount: 4400000,
      status: "overdue",
    });

    expect(row[0]).toBe("Lippo Pekanbaru 36 ha");
    expect(row[6]).toBe("40,000,000");
    expect(row[7]).toBe("11%");
    expect(row[8]).toBe("4,400,000");
    expect(row[9]).toBe("Overdue"); // Status humanized
  });

  it("CSV and XLSX share identical headers", () => {
    expect(PROJECT_EXPORT_HEADERS).toContain("Client");
    expect(PROJECT_EXPORT_HEADERS).toContain("Project Owner");
    expect(PROJECT_EXPORT_HEADERS).toContain("Project Lead");
    expect(PROJECT_EXPORT_HEADERS).toContain("Last Updated");
    expect(FINANCE_EXPORT_HEADERS).toContain("Tax %");
    expect(FINANCE_EXPORT_HEADERS).toContain("Status");
  });

  it("CSV mapper and XLSX mapper produce identical values", async () => {
    const { mapProjectRow } = await import("@/lib/xlsx/projects-export");
    const { mapInvoiceRow } = await import("@/lib/xlsx/finance-export");

    const project = {
      project_code: "HDA-26003",
      name: "Lippo Cikao 20 ha",
      client_name: "Lippo Group",
      lifecycle_status: "on_hold",
      health_status: "at_risk",
      location: "Purwakarta",
      start_date: "2026-02-02",
      target_end_date: "2026-08-14",
      contract_value: 95000000,
      project_owner_name: "Farid Ramdani",
      project_lead_name: "Mira Wulandari",
      updated_at: "2026-04-18T04:00:00.000Z",
    };
    expect(mapProjectRow(project)).toEqual(mapProjectExportRow(project));

    const invoice = {
      project_name: "Lippo Cikao 20 ha",
      invoice_number: "INV-26003",
      title: "Concept Framing Phase",
      issued_date: "2026-03-30",
      due_date: "2026-04-15",
      paid_at: "",
      invoice_amount: 35000000,
      tax_percentage: 11,
      tax_amount: 3850000,
      status: "issued",
    };
    expect(mapInvoiceRow(invoice)).toEqual(mapInvoiceExportRow(invoice));
  });
});
