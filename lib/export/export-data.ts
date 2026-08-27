import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { getFallbackStudioOsSource } from "@/lib/supabase/fallback";

type RawRecord = Record<string, unknown>;

function clientNameOf(rec: RawRecord): string {
  const client = rec.client;
  if (Array.isArray(client)) {
    return typeof client[0]?.name === "string" ? client[0].name : "";
  }
  if (client && typeof client === "object") {
    return typeof (client as { name?: unknown }).name === "string"
      ? ((client as { name: string }).name)
      : "";
  }
  return "";
}

function toProjectExportRow(rec: RawRecord) {
  return {
    project_code: String(rec.project_code ?? ""),
    name: String(rec.name ?? ""),
    client_name: clientNameOf(rec),
    lifecycle_status: String(rec.lifecycle_status ?? ""),
    health_status: String(rec.health_status ?? ""),
    location: typeof rec.location === "string" ? rec.location : "",
    start_date: rec.start_date ? String(rec.start_date) : "",
    target_end_date: rec.target_end_date ? String(rec.target_end_date) : "",
    contract_value: Number(rec.contract_value) || 0,
    project_owner_name:
      typeof rec.project_owner_name === "string" ? rec.project_owner_name : "",
    project_lead_name:
      typeof rec.project_lead_name === "string" ? rec.project_lead_name : "",
    updated_at: typeof rec.updated_at === "string" ? rec.updated_at : "",
  };
}

function toInvoiceExportRow(rec: RawRecord) {
  const project = rec.project;
  const projectName =
    Array.isArray(project) && typeof project[0]?.name === "string"
      ? project[0].name
      : project && typeof project === "object" && typeof (project as { name?: unknown }).name === "string"
        ? ((project as { name: string }).name)
        : "";
  return {
    project_name: projectName,
    invoice_number: String(rec.invoice_number ?? ""),
    title: String(rec.title ?? ""),
    issued_date: rec.issued_date ? String(rec.issued_date) : "",
    due_date: rec.due_date ? String(rec.due_date) : "",
    paid_at: rec.paid_at ? String(rec.paid_at) : "",
    invoice_amount: Number(rec.invoice_amount) || 0,
    tax_percentage: rec.tax_percentage == null ? 0 : Number(rec.tax_percentage),
    tax_amount: Number(rec.tax_amount) || 0,
    status: String(rec.status ?? ""),
  };
}

// Load project rows from the live DB (base columns + client join, with a
// guarded attempt at the owner/lead columns that only exist in newer
// migrations). Falls back to seeded data when the live query is unavailable.
export async function loadProjectExportRows(): Promise<
  ReturnType<typeof toProjectExportRow>[]
> {
  const env = getSupabaseEnv();

  const fallbackRows = () =>
    getFallbackStudioOsSource()
      .projects.filter((p) => (p as RawRecord).is_archived !== true)
      .map((p) => toProjectExportRow(p as unknown as RawRecord));

  if (!env) {
    return fallbackRows();
  }

  try {
    const supabase = await createSupabaseServerClient();

    const base = await supabase
      .from("projects")
      .select(
        `project_code, name, client_id, lifecycle_status, health_status,
         start_date, target_end_date, contract_value, currency,
         location, updated_at,
         project_owner_name, project_lead_name,
         client:clients!projects_client_id_fkey(id, name)`,
      )
      .order("updated_at", { ascending: false });

    if (base.error || !base.data) {
      return fallbackRows();
    }

    return (base.data as RawRecord[]).map(toProjectExportRow);
  } catch {
    return fallbackRows();
  }
}

// Load invoice rows from the live DB, falling back to seeded data.
export async function loadInvoiceExportRows(): Promise<
  ReturnType<typeof toInvoiceExportRow>[]
> {
  const env = getSupabaseEnv();

  const fallbackRows = () =>
    getFallbackStudioOsSource()
      .invoices.map((i) => toInvoiceExportRow(i as unknown as RawRecord));

  if (!env) {
    return fallbackRows();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const res = await supabase.from("invoices").select(`
      invoice_number, title, issued_date, due_date, paid_at, invoice_amount,
      tax_percentage, tax_amount, status,
      project:projects!invoices_project_id_fkey(name)
    `);
    if (res.error || !res.data) {
      return fallbackRows();
    }
    return (res.data as RawRecord[]).map(toInvoiceExportRow);
  } catch {
    return fallbackRows();
  }
}
