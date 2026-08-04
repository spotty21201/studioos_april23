import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { getFallbackStudioOsSource } from "@/lib/supabase/fallback";
import {
  formatDataWarning,
  getEmptyStudioOsSource,
  processStudioOsQueryResults,
  type DataEnvelope,
  type DataSource,
  type StudioOsSource,
} from "@/lib/supabase/query-processor";

export type { DataEnvelope, DataSource, StudioOsSource };

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
        created_at,
        updated_at,
        created_by,
        updated_by,
        client:clients!projects_client_id_fkey(id, name),
        primary_contact:client_contacts!projects_primary_contact_id_fkey(id, full_name, email, job_title)
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

    return processStudioOsQueryResults({
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
    });
  } catch (error) {
    return {
      source: "supabase",
      warning: formatDataWarning(error),
      data: getEmptyStudioOsSource(),
    };
  }
});
