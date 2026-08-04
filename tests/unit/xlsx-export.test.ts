import { describe, it, expect } from "vitest";
import * as projectsExport from "@/lib/xlsx/projects-export";
import * as financeExport from "@/lib/xlsx/finance-export";

describe("XLSX Export - Projects (lib/xlsx/projects-export.ts)", () => {
  const mockProjects = [
    {
      project_code: "HDA-26001",
      name: "Lippo Pekanbaru 36 ha",
      client_name: "Lippo Group",
      lifecycle_status: "active",
      health_status: "watch",
      location: "Pekanbaru, Riau",
      start_date: "2026-01-12",
      target_end_date: "2026-07-10",
      contract_value: 125000000,
      currency: "IDR",
      project_owner_name: "Doddy Samiaji",
      project_lead_name: "Maya Puspa",
      updated_at: "2026-04-22T02:10:00.000Z",
    },
    {
      project_code: "HDA-26002",
      name: "Lippo Puncak 18 ha",
      client_name: "Lippo Group",
      lifecycle_status: "active",
      health_status: "on_track",
      location: "Puncak, Jawa Barat",
      start_date: "2026-01-05",
      target_end_date: "2026-06-02",
      contract_value: 85000000,
      currency: "IDR",
      project_owner_name: "Dodi Supriyatna",
      project_lead_name: "Indri Ramadhani",
      updated_at: "2026-04-21T08:30:00.000Z",
    },
  ];

  it("column headers match expected values", async () => {
    const rows = mockProjects.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;
    const headerRow = worksheet.getRow(1);

    expect(worksheet.columns.length).toBe(projectsExport.PROJECT_HEADERS.length);

    for (let i = 0; i < projectsExport.PROJECT_HEADERS.length; i++) {
      expect(headerRow.getCell(i + 1).value).toBe(
        projectsExport.PROJECT_HEADERS[i],
      );
    }
  });

  it("row count matches source record count", async () => {
    const rows = mockProjects.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;

    expect(worksheet.rowCount).toBe(mockProjects.length + 1);
  });

  it("first data row contains mapped project data correctly", async () => {
    const rows = mockProjects.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;
    const firstDataRow = worksheet.getRow(2);

    expect(firstDataRow.getCell(1).value).toBe("HDA-26001");
    expect(firstDataRow.getCell(2).value).toBe("Lippo Pekanbaru 36 ha");
    expect(firstDataRow.getCell(3).value).toBe("Lippo Group");
    expect(firstDataRow.getCell(4).value).toBe("Active");
    expect(firstDataRow.getCell(5).value).toBe("Needs a closer look");
    expect(firstDataRow.getCell(9).value).toBe("125,000,000");
    expect(firstDataRow.getCell(10).value).toBe("Doddy Samiaji");
  });

  it("headers have bold styling", async () => {
    const rows = mockProjects.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;
    const headerRow = worksheet.getRow(1);

    for (let col = 1; col <= projectsExport.PROJECT_HEADERS.length; col++) {
      expect(headerRow.getCell(col).font?.bold).toBe(true);
    }
  });

  it("headers have background color #F3F4F6", async () => {
    const rows = mockProjects.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;
    const headerRow = worksheet.getRow(1);

    for (let col = 1; col <= projectsExport.PROJECT_HEADERS.length; col++) {
      const cellFill = headerRow.getCell(col).fill as unknown;
      const fillColor = (cellFill as Record<string, Record<string, string> | undefined>)?.fgColor;
      expect(fillColor?.argb).toBe("FFF3F4F6");
    }
  });

  it("data rows have text wrapping enabled", async () => {
    const rows = mockProjects.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;

    for (let row = 2; row <= worksheet.rowCount; row++) {
      for (let col = 1; col <= projectsExport.PROJECT_HEADERS.length; col++) {
        expect(worksheet.getCell(row, col).alignment?.wrapText).toBe(true);
      }
    }
  });

  it("mapProjectRow formats currency correctly", () => {
    const project = {
      project_code: "TEST-001",
      name: "Test Project",
      client_name: "Test Client",
      lifecycle_status: "proposal",
      health_status: "on_track",
      location: "Jakarta",
      start_date: "2026-03-01",
      target_end_date: "2026-12-31",
      contract_value: 250000000,
      project_owner_name: "Owner One",
      project_lead_name: "Lead One",
      updated_at: "2026-04-01T10:00:00.000Z",
    };
    const row = projectsExport.mapProjectRow(project);
    expect(row[8]).toBe("250,000,000");
  });

  it("mapProjectRow handles missing/null fields", () => {
    const project = {
      project_code: "HDA-001",
      name: null,
      client_name: undefined,
      lifecycle_status: "",
      health_status: null,
      location: null,
      start_date: null,
      target_end_date: null,
      contract_value: 0,
      project_owner_name: null,
      project_lead_name: undefined,
      updated_at: null,
    };
    const row = projectsExport.mapProjectRow(project as unknown as projectsExport.ProjectData);
    expect(row[1]).toBe("");
    expect(row[2]).toBe("");
    expect(row[8]).toBe("0");
  });

  it("hasArchivedFlag detects is_archived property", () => {
    const active = { project_code: "A", name: "Test", is_archived: false };
    const archived = { project_code: "B", name: "Old", is_archived: true };

    expect(projectsExport.isProjectActive(active)).toBe(true);
    expect(projectsExport.isProjectActive(archived)).toBe(false);
  });

  it("formatTimestamp returns YYYY-MM-DD format", () => {
    const ts = projectsExport.formatTimestamp();
    expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formatProjectsFilename has correct pattern with timestamp", () => {
    const filename = projectsExport.formatProjectsFilename();
    expect(filename).toMatch(/^studioos-projects-\d{4}-\d{2}-\d{2}\.xlsx$/);
  });

  it("empty rows produces workbook with only a header row", async () => {
    const workbook = projectsExport.buildProjectsWorkbook([]);
    const worksheet = workbook.getWorksheet("Projects")!;

    expect(worksheet.rowCount).toBe(1);
  });

  it("columns constant has all 12 expected headers", () => {
    expect(projectsExport.PROJECT_HEADERS.length).toBe(12);
    expect(projectsExport.PROJECT_HEADERS[0]).toBe("Project Code");
    expect(projectsExport.PROJECT_HEADERS[3]).toBe("Stage");
    expect(projectsExport.PROJECT_HEADERS[8]).toBe("Contract Value (IDR)");
    expect(projectsExport.PROJECT_HEADERS[11]).toBe("Last Updated");
  });

  it("works with large dataset", async () => {
    const largeSet: projectsExport.ProjectData[] = Array.from({ length: 50 }, (_, i) => ({
      project_code: "HDA-" + String(26000 + i).padStart(5, "0"),
      name: "Project Number " + (i + 1),
      client_name: "Client " + (i % 5),
      lifecycle_status: ["active", "completed", "proposal"][i % 3],
      health_status: ["on_track", "watch", "at_risk"][i % 3],
      location: "Location " + (i + 1),
      start_date: "2026-0" + ((i % 6) + 1) + "-01",
      target_end_date: "2026-12-31",
      contract_value: (i + 1) * 10000000,
      project_owner_name: "Owner " + (i % 3),
      project_lead_name: i % 2 === 0 ? "Lead A" : "Lead B",
      updated_at: "2026-0" + ((i % 4) + 1) + "-" + String((i % 28) + 1).padStart(2, "0") + "T12:00:00.000Z",
    }));
    const rows = largeSet.map(projectsExport.mapProjectRow);
    const workbook = projectsExport.buildProjectsWorkbook(rows);
    const worksheet = workbook.getWorksheet("Projects")!;

    expect(worksheet.rowCount).toBe(largeSet.length + 1);

    const lastDataRow = worksheet.getRow(worksheet.rowCount);
    expect(lastDataRow.getCell(1).value).toBe("HDA-26049");
  });
});

describe("XLSX Export - Finance (lib/xlsx/finance-export.ts)", () => {
  const mockInvoices = [
    {
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
    },
    {
      project_name: "Lippo Puncak 18 ha",
      invoice_number: "INV-26002",
      title: "Resort Layout Approval Stage",
      issued_date: "2026-04-01",
      due_date: "2026-04-25",
      paid_at: "2026-04-20",
      invoice_amount: 30000000,
      tax_percentage: 11,
      tax_amount: 3300000,
      status: "paid",
    },
  ];

  it("columns constant has all 10 expected headers", () => {
    expect(financeExport.FINANCE_HEADERS.length).toBe(10);
    expect(financeExport.FINANCE_HEADERS[0]).toBe("Project");
    expect(financeExport.FINANCE_HEADERS[6]).toBe("Amount (IDR)");
    expect(financeExport.FINANCE_HEADERS[8]).toBe("Tax Amount (IDR)");
  });

  it("mapInvoiceRow formats amount and tax correctly", () => {
    const row = financeExport.mapInvoiceRow(mockInvoices[0]);
    expect(row[6]).toBe("40,000,000");
    expect(row[7]).toBe("11%");
    expect(row[8]).toBe("4,400,000");
  });

  it("row count matches source record count", async () => {
    const rows = mockInvoices.map(financeExport.mapInvoiceRow);
    const workbook = financeExport.buildFinanceWorkbook(rows);
    const worksheet = workbook.getWorksheet("Finance")!;

    expect(worksheet.rowCount).toBe(mockInvoices.length + 1);
  });

  it("first data row contains mapped invoice data correctly", async () => {
    const rows = mockInvoices.map(financeExport.mapInvoiceRow);
    const workbook = financeExport.buildFinanceWorkbook(rows);
    const worksheet = workbook.getWorksheet("Finance")!;
    const firstDataRow = worksheet.getRow(2);

    expect(firstDataRow.getCell(1).value).toBe("Lippo Pekanbaru 36 ha");
    expect(firstDataRow.getCell(2).value).toBe("INV-26001");
    expect(firstDataRow.getCell(3).value).toBe("Master Plan Concept Milestone");
    expect(firstDataRow.getCell(4).value).toBe("2026-03-28");
    expect(firstDataRow.getCell(5).value).toBe("2026-04-12");
    expect(firstDataRow.getCell(6).value).toBe("");
    expect(firstDataRow.getCell(7).value).toBe("40,000,000");
    expect(firstDataRow.getCell(8).value).toBe("11%");
    expect(firstDataRow.getCell(9).value).toBe("4,400,000");
    expect(firstDataRow.getCell(10).value).toBe("Overdue");
  });

  it("headers have bold styling", async () => {
    const rows = mockInvoices.map(financeExport.mapInvoiceRow);
    const workbook = financeExport.buildFinanceWorkbook(rows);
    const worksheet = workbook.getWorksheet("Finance")!;
    const headerRow = worksheet.getRow(1);

    for (let col = 1; col <= financeExport.FINANCE_HEADERS.length; col++) {
      expect(headerRow.getCell(col).font?.bold).toBe(true);
    }
  });

  it("headers have background color #F3F4F6", async () => {
    const rows = mockInvoices.map(financeExport.mapInvoiceRow);
    const workbook = financeExport.buildFinanceWorkbook(rows);
    const worksheet = workbook.getWorksheet("Finance")!;
    const headerRow = worksheet.getRow(1);

    for (let col = 1; col <= financeExport.FINANCE_HEADERS.length; col++) {
      const cellFill = headerRow.getCell(col).fill as unknown;
      const fillColor = (cellFill as Record<string, Record<string, string> | undefined>)?.fgColor;
      expect(fillColor?.argb).toBe("FFF3F4F6");
    }
  });

  it("data rows have text wrapping enabled", async () => {
    const rows = mockInvoices.map(financeExport.mapInvoiceRow);
    const workbook = financeExport.buildFinanceWorkbook(rows);
    const worksheet = workbook.getWorksheet("Finance")!;

    for (let row = 2; row <= worksheet.rowCount; row++) {
      for (let col = 1; col <= financeExport.FINANCE_HEADERS.length; col++) {
        expect(worksheet.getCell(row, col).alignment?.wrapText).toBe(true);
      }
    }
  });

  it("formatFinanceFilename has correct pattern with timestamp", () => {
    const filename = financeExport.formatFinanceFilename();
    expect(filename).toMatch(/^studioos-finance-\d{4}-\d{2}-\d{2}\.xlsx$/);
  });

  it("empty rows produces workbook with only a header row", async () => {
    const workbook = financeExport.buildFinanceWorkbook([]);
    const worksheet = workbook.getWorksheet("Finance")!;

    expect(worksheet.rowCount).toBe(1);
  });

  it("mapInvoiceRow handles missing fields gracefully", () => {
    const emptyInv = {
      project_name: "",
      invoice_number: "",
      title: "",
      issued_date: "",
      due_date: "",
      paid_at: "",
      invoice_amount: 0,
      tax_percentage: 0,
      tax_amount: 0,
      status: "",
    };
    const row = financeExport.mapInvoiceRow(emptyInv);
    expect(row.filter((cell) => cell === "").length).toBe(7);
  });
});
