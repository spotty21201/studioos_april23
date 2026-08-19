import { describe, expect, it, vi } from "vitest";
import { getFinancePageData } from "../../lib/studio-data";

const invoiceBase = {
  project_id: "project-1",
  client_id: "client-1",
  title: "Milestone billing",
  due_date: "2026-08-31",
  invoice_amount: 25_000_000,
  paid_at: null,
  tax_percentage: 11,
  tax_amount: 2_750_000,
  tax_status: "unpaid" as const,
  notes: null,
  created_at: "2026-08-18T00:00:00Z",
  updated_at: "2026-08-18T00:00:00Z",
  created_by: null,
  updated_by: null,
  project: {
    id: "project-1",
    project_code: "HDA-26018",
    name: "Mira Test Project",
    slug: "mira-test-project",
  },
  client: { id: "client-1", name: "Test Client" },
};

vi.mock("@/lib/supabase/queries", () => ({
  getStudioOsSource: async () => ({
    source: "configured_live" as const,
    warning: null,
    data: {
      projects: [
        {
          id: "project-1",
          contract_value: 100_000_000,
          is_archived: false,
        },
      ],
      invoices: [
        {
          ...invoiceBase,
          id: "invoice-draft",
          invoice_number: "DRAFT-001",
          issued_date: null,
          status: "draft" as const,
        },
        {
          ...invoiceBase,
          id: "invoice-issued",
          invoice_number: "INV-001",
          issued_date: "2026-08-18",
          status: "issued" as const,
        },
        {
          ...invoiceBase,
          id: "invoice-overdue",
          invoice_number: "INV-OVERDUE",
          issued_date: "2026-07-01",
          due_date: "2026-07-31",
          status: "overdue" as const,
        },
      ],
      vendorObligations: [],
      projectFinanceSummaries: [],
      financeOverview: {
        contract_value_total: 100_000_000,
        total_invoiced: 50_000_000,
        total_paid: 0,
        outstanding_receivable: 50_000_000,
        outstanding_payable: 0,
        unpaid_tax_total: 8_250_000,
      },
    },
  }),
}));

describe("Finance page invoice visibility", () => {
  it("returns every saved invoice, including drafts", async () => {
    const data = await getFinancePageData();

    expect(data.invoices.map((invoice) => invoice.invoiceNumber)).toEqual([
      "DRAFT-001",
      "INV-001",
      "INV-OVERDUE",
    ]);
    expect(data.invoices.find((invoice) => invoice.status === "draft")).toBeDefined();
  });

  it("keeps the follow-up list limited to overdue invoices", async () => {
    const data = await getFinancePageData();

    expect(data.overdueInvoices).toHaveLength(1);
    expect(data.overdueInvoices[0].invoiceNumber).toBe("INV-OVERDUE");
  });

  it("filters the invoice register by status", async () => {
    const data = await getFinancePageData({ status: "draft" });

    expect(data.filters.status).toBe("draft");
    expect(data.totalInvoiceCount).toBe(3);
    expect(data.filteredInvoiceCount).toBe(1);
    expect(data.invoices[0].invoiceNumber).toBe("DRAFT-001");
  });

  it("searches invoice, project, and client labels case-insensitively", async () => {
    const byProject = await getFinancePageData({ q: "mira test" });
    const byInvoice = await getFinancePageData({ q: "inv-overdue" });

    expect(byProject.filteredInvoiceCount).toBe(3);
    expect(byInvoice.invoices.map((invoice) => invoice.invoiceNumber)).toEqual([
      "INV-OVERDUE",
    ]);
  });
});
