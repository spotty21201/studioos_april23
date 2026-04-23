import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { getFallbackStudioOsSource } from "@/lib/supabase/fallback";
import type {
  ActivityEventRecordRow,
  DashboardSnapshotRow,
  DocumentRecordRow,
  FinanceOverviewRow,
  InvoiceRecordRow,
  NoteRecordRow,
  ProjectAttentionItemRow,
  ProjectAttentionSummaryRow,
  ProjectFinanceSummaryRow,
  ProjectRecordRow,
  StudioProfileRow,
  VendorObligationRecordRow,
} from "@/lib/supabase/view-contracts";

export type DataSource = "supabase" | "fallback";

export type DataEnvelope<T> = {
  source: DataSource;
  warning: string | null;
  data: T;
};

export type StudioOsSource = {
  studioProfile: StudioProfileRow | null;
  projects: ProjectRecordRow[];
  projectFinanceSummaries: ProjectFinanceSummaryRow[];
  projectAttentionItems: ProjectAttentionItemRow[];
  projectAttentionSummaries: ProjectAttentionSummaryRow[];
  financeOverview: FinanceOverviewRow | null;
  dashboardSnapshot: DashboardSnapshotRow | null;
  invoices: InvoiceRecordRow[];
  vendorObligations: VendorObligationRecordRow[];
  documents: DocumentRecordRow[];
  notes: NoteRecordRow[];
  activityEvents: ActivityEventRecordRow[];
};

function getEmptyStudioOsSource(): StudioOsSource {
  return {
    studioProfile: null,
    projects: [],
    projectFinanceSummaries: [],
    projectAttentionItems: [],
    projectAttentionSummaries: [],
    financeOverview: null,
    dashboardSnapshot: null,
    invoices: [],
    vendorObligations: [],
    documents: [],
    notes: [],
    activityEvents: [],
  };
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Supabase query failure.";
}

function formatDataWarning(error: unknown) {
  const message = toErrorMessage(error);

  if (message.includes("Could not find the table 'public.profiles' in the schema cache")) {
    return "Supabase data is currently unavailable because the `profiles` table is missing from the schema cache. Authenticated screens remain accessible, but live workspace data cannot load until backend cache support is restored.";
  }

  if (message.includes("schema cache")) {
    return `Supabase data is temporarily unavailable because the schema cache is incomplete. Live workspace data cannot load until the backend environment is repaired. ${message}`;
  }

  return `Supabase data load failed. Live workspace data is unavailable until the backend environment is repaired. ${message}`;
}

export const getStudioOsSource = cache(async (): Promise<DataEnvelope<StudioOsSource>> => {
  const env = getSupabaseEnv();

  if (!env) {
    return {
      source: "fallback",
      warning:
        "Supabase environment is not configured. Workspace screens are rendering from isolated fallback records.",
      data: getFallbackStudioOsSource(),
    };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const [
      studioProfileResult,
      projectsResult,
      projectFinanceSummaryResult,
      projectAttentionItemsResult,
      projectAttentionSummariesResult,
      financeOverviewResult,
      dashboardSnapshotResult,
      invoicesResult,
      vendorObligationsResult,
      documentsResult,
      notesResult,
      activityEventsResult,
    ] = await Promise.all([
      supabase
        .from("studio_profile")
        .select("id, studio_name, default_currency, timezone, created_at, updated_at")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase.from("projects").select(`
        id,
        project_code,
        name,
        slug,
        client_id,
        primary_contact_id,
        lifecycle_status,
        health_status,
        summary,
        location,
        start_date,
        target_end_date,
        completed_at,
        contract_value,
        currency,
        project_owner_id,
        last_reviewed_at,
        created_at,
        updated_at,
        created_by,
        updated_by,
        client:clients!projects_client_id_fkey(id, name),
        primary_contact:client_contacts!projects_primary_contact_id_fkey(id, full_name, email, job_title),
        project_owner:profiles!projects_project_owner_id_fkey(id, full_name, email, role)
      `),
      supabase.from("project_finance_summary_v").select(`
        project_id,
        contract_value,
        total_invoiced,
        total_paid,
        outstanding_receivable,
        total_vendor_value,
        total_vendor_paid,
        outstanding_payable,
        total_tax_unpaid
      `),
      supabase.from("project_attention_items_v").select(`
        attention_item_id,
        project_id,
        project_code,
        project_name,
        client_name,
        attention_label,
        attention_summary,
        created_at
      `),
      supabase.from("project_attention_summary_v").select(`
        project_id,
        attention_count,
        needs_attention
      `),
      supabase
        .from("finance_overview_v")
        .select(`
          contract_value_total,
          total_invoiced,
          total_paid,
          outstanding_receivable,
          outstanding_payable,
          unpaid_tax_total
        `)
        .maybeSingle(),
      supabase
        .from("dashboard_snapshot_v")
        .select("active_projects, projects_needing_attention")
        .maybeSingle(),
      supabase.from("invoices").select(`
        id,
        project_id,
        client_id,
        invoice_number,
        title,
        issued_date,
        due_date,
        invoice_amount,
        status,
        paid_at,
        tax_percentage,
        tax_amount,
        tax_status,
        notes,
        created_at,
        updated_at,
        created_by,
        updated_by,
        project:projects!invoices_project_id_fkey(id, project_code, name, slug),
        client:clients!invoices_client_id_fkey(id, name)
      `),
      supabase.from("vendor_obligations").select(`
        id,
        project_id,
        vendor_id,
        title,
        description,
        due_date,
        amount,
        status,
        paid_at,
        tax_percentage,
        tax_amount,
        tax_status,
        notes,
        created_at,
        updated_at,
        created_by,
        updated_by,
        project:projects!vendor_obligations_project_id_fkey(id, project_code, name, slug),
        vendor:vendors!vendor_obligations_vendor_id_fkey(id, name)
      `),
      supabase.from("documents").select(`
        id,
        project_id,
        title,
        category,
        source_type,
        file_path,
        external_url,
        linked_entity_type,
        linked_entity_id,
        document_date,
        description,
        created_at,
        updated_at,
        created_by,
        updated_by,
        project:projects!documents_project_id_fkey(id, project_code, name, slug)
      `),
      supabase.from("notes").select(`
        id,
        project_id,
        author_id,
        title,
        body,
        note_type,
        linked_entity_type,
        linked_entity_id,
        noted_at,
        created_at,
        updated_at,
        created_by,
        updated_by,
        project:projects!notes_project_id_fkey(id, project_code, name, slug),
        author:profiles!notes_author_id_fkey(id, full_name, email, role)
      `),
      supabase.from("activity_events").select(`
        id,
        project_id,
        actor_id,
        event_type,
        entity_type,
        entity_id,
        summary,
        metadata,
        occurred_at,
        created_at,
        updated_at,
        project:projects!activity_events_project_id_fkey(id, project_code, name, slug),
        actor:profiles!activity_events_actor_id_fkey(id, full_name, email, role)
      `),
    ]);

    const errors = [
      studioProfileResult.error,
      projectsResult.error,
      projectFinanceSummaryResult.error,
      projectAttentionItemsResult.error,
      projectAttentionSummariesResult.error,
      financeOverviewResult.error,
      dashboardSnapshotResult.error,
      invoicesResult.error,
      vendorObligationsResult.error,
      documentsResult.error,
      notesResult.error,
      activityEventsResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      throw new Error(errors.map((error) => error?.message).join(" | "));
    }

    const projects = ((projectsResult.data ?? []) as unknown[]).map((row) => {
      const record = row as ProjectRecordRow & {
        client: ProjectRecordRow["client"] | ProjectRecordRow["client"][];
        primary_contact:
          | ProjectRecordRow["primary_contact"]
          | ProjectRecordRow["primary_contact"][];
        project_owner:
          | ProjectRecordRow["project_owner"]
          | ProjectRecordRow["project_owner"][];
      };

      return {
        ...record,
        client: firstRelation(record.client),
        primary_contact: firstRelation(record.primary_contact),
        project_owner: firstRelation(record.project_owner),
      };
    });

    const invoices = ((invoicesResult.data ?? []) as unknown[]).map((row) => {
      const record = row as InvoiceRecordRow & {
        project: InvoiceRecordRow["project"] | InvoiceRecordRow["project"][];
        client: InvoiceRecordRow["client"] | InvoiceRecordRow["client"][];
      };

      return {
        ...record,
        project: firstRelation(record.project),
        client: firstRelation(record.client),
      };
    });

    const vendorObligations = ((vendorObligationsResult.data ?? []) as unknown[]).map(
      (row) => {
        const record = row as VendorObligationRecordRow & {
          project:
            | VendorObligationRecordRow["project"]
            | VendorObligationRecordRow["project"][];
          vendor:
            | VendorObligationRecordRow["vendor"]
            | VendorObligationRecordRow["vendor"][];
        };

        return {
          ...record,
          project: firstRelation(record.project),
          vendor: firstRelation(record.vendor),
        };
      },
    );

    const documents = ((documentsResult.data ?? []) as unknown[]).map((row) => {
      const record = row as DocumentRecordRow & {
        project: DocumentRecordRow["project"] | DocumentRecordRow["project"][];
      };

      return {
        ...record,
        project: firstRelation(record.project),
      };
    });

    const notes = ((notesResult.data ?? []) as unknown[]).map((row) => {
      const record = row as NoteRecordRow & {
        project: NoteRecordRow["project"] | NoteRecordRow["project"][];
        author: NoteRecordRow["author"] | NoteRecordRow["author"][];
      };

      return {
        ...record,
        project: firstRelation(record.project),
        author: firstRelation(record.author),
      };
    });

    const activityEvents = ((activityEventsResult.data ?? []) as unknown[]).map(
      (row) => {
        const record = row as ActivityEventRecordRow & {
          project:
            | ActivityEventRecordRow["project"]
            | ActivityEventRecordRow["project"][];
          actor: ActivityEventRecordRow["actor"] | ActivityEventRecordRow["actor"][];
        };

        return {
          ...record,
          project: firstRelation(record.project),
          actor: firstRelation(record.actor),
        };
      },
    );

    return {
      source: "supabase",
      warning: null,
      data: {
        studioProfile:
          (studioProfileResult.data as StudioProfileRow | null | undefined) ?? null,
        projects,
        projectFinanceSummaries:
          (projectFinanceSummaryResult.data ?? []) as ProjectFinanceSummaryRow[],
        projectAttentionItems:
          (projectAttentionItemsResult.data ?? []) as ProjectAttentionItemRow[],
        projectAttentionSummaries:
          (projectAttentionSummariesResult.data ?? []) as ProjectAttentionSummaryRow[],
        financeOverview:
          (financeOverviewResult.data as FinanceOverviewRow | null | undefined) ?? null,
        dashboardSnapshot:
          (dashboardSnapshotResult.data as DashboardSnapshotRow | null | undefined) ??
          null,
        invoices,
        vendorObligations,
        documents,
        notes,
        activityEvents,
      },
    };
  } catch (error) {
    return {
      source: "supabase",
      warning: formatDataWarning(error),
      data: getEmptyStudioOsSource(),
    };
  }
});
