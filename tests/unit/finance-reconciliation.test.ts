import { describe, expect, it } from "vitest";
import {
  reconcileProjectFinance,
  summarizeCurrentFinance,
} from "../../lib/finance/reconciliation";
import type {
  InvoiceRecordRow,
  ProjectRecordRow,
  VendorObligationRecordRow,
} from "../../lib/supabase/view-contracts";

function project(id: string, contractValue: number, isArchived = false) {
  return { id, contract_value: contractValue, is_archived: isArchived } as ProjectRecordRow;
}

function invoice(
  id: string,
  projectId: string,
  status: InvoiceRecordRow["status"],
  amount: number,
  taxAmount: number,
  taxStatus: InvoiceRecordRow["tax_status"] = "unpaid",
) {
  return {
    id,
    project_id: projectId,
    status,
    invoice_amount: amount,
    tax_amount: taxAmount,
    tax_status: taxStatus,
  } as InvoiceRecordRow;
}

function obligation(
  id: string,
  status: VendorObligationRecordRow["status"],
  amount: number,
  taxAmount: number,
  taxStatus: VendorObligationRecordRow["tax_status"] = "unpaid",
) {
  return {
    id,
    project_id: "project-current",
    status,
    amount,
    tax_amount: taxAmount,
    tax_status: taxStatus,
  } as VendorObligationRecordRow;
}

describe("authoritative finance reconciliation", () => {
  const projects = [
    project("project-current", 530_000_000),
    project("project-archived", 90_000_000, true),
  ];
  const invoices = [
    invoice("draft", "project-current", "draft", 100, 11),
    invoice("issued", "project-current", "issued", 200, 22),
    invoice("overdue", "project-current", "overdue", 300, 33),
    invoice("paid", "project-current", "paid", 400, 44, "paid"),
    invoice("cancelled", "project-current", "cancelled", 500, 55),
    invoice("archived", "project-archived", "issued", 1_000, 110),
  ];
  const obligations = [
    obligation("planned", "planned", 100, 11),
    obligation("due", "due", 200, 22),
    obligation("overdue", "overdue", 300, 33, "paid"),
    obligation("paid", "paid", 400, 44),
    obligation("cancelled", "cancelled", 500, 55),
  ];

  it("excludes draft and cancelled invoices from issued totals", () => {
    const summaries = reconcileProjectFinance(projects, invoices, obligations);
    const current = summaries.find((summary) => summary.project_id === "project-current");

    expect(current).toMatchObject({
      total_invoiced: 900,
      total_paid: 400,
      outstanding_receivable: 500,
      total_vendor_value: 1_000,
      total_vendor_paid: 400,
      outstanding_payable: 500,
      total_tax_unpaid: 121,
    });
  });

  it("excludes archived projects from workspace-wide totals", () => {
    const summaries = reconcileProjectFinance(projects, invoices, obligations);
    const overview = summarizeCurrentFinance(projects, summaries);

    expect(overview.contractValue).toBe(530_000_000);
    expect(overview.totalInvoiced).toBe(900);
    expect(overview.outstandingReceivable).toBe(500);
  });
});
