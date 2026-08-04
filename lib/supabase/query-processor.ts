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
} from "./view-contracts";

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

export type QuerySingleResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

export type QueryArrayResult<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

export type RawStudioOsQueryResults = {
  studioProfileResult: QuerySingleResult<StudioProfileRow>;
  projectsResult: QueryArrayResult<unknown>;
  projectFinanceSummaryResult: QueryArrayResult<ProjectFinanceSummaryRow>;
  projectAttentionItemsResult: QueryArrayResult<ProjectAttentionItemRow>;
  projectAttentionSummariesResult: QueryArrayResult<ProjectAttentionSummaryRow>;
  financeOverviewResult: QuerySingleResult<FinanceOverviewRow>;
  dashboardSnapshotResult: QuerySingleResult<DashboardSnapshotRow>;
  invoicesResult: QueryArrayResult<unknown>;
  vendorObligationsResult: QueryArrayResult<unknown>;
  documentsResult: QueryArrayResult<unknown>;
  notesResult: QueryArrayResult<unknown>;
  activityEventsResult: QueryArrayResult<unknown>;
};

export function getEmptyStudioOsSource(): StudioOsSource {
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

export function formatDataWarning(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown failure.");

  if (message.includes("Could not find the table 'public.profiles' in the schema cache")) {
    return "Supabase data is currently unavailable because the `profiles` table is missing from the schema cache.";
  }

  if (message.includes("schema cache")) {
    return `Supabase data is temporarily unavailable because the schema cache is incomplete: ${message}`;
  }

  return `Supabase data load failed. Live workspace data is unavailable: ${message}`;
}

export function processStudioOsQueryResults(
  results: RawStudioOsQueryResults,
): DataEnvelope<StudioOsSource> {
  const failedDomains: string[] = [];

  if (results.studioProfileResult.error) failedDomains.push("studio_profile");
  if (results.projectsResult.error) failedDomains.push("projects");
  if (results.projectFinanceSummaryResult.error) failedDomains.push("project_finance_summary");
  if (results.projectAttentionItemsResult.error) failedDomains.push("project_attention_items");
  if (results.projectAttentionSummariesResult.error) failedDomains.push("project_attention_summary");
  if (results.financeOverviewResult.error) failedDomains.push("finance_overview");
  if (results.dashboardSnapshotResult.error) failedDomains.push("dashboard_snapshot");
  if (results.invoicesResult.error) failedDomains.push("invoices");
  if (results.vendorObligationsResult.error) failedDomains.push("vendor_obligations");
  if (results.documentsResult.error) failedDomains.push("documents");
  if (results.notesResult.error) failedDomains.push("notes");
  if (results.activityEventsResult.error) failedDomains.push("activity_events");

  const warning =
    failedDomains.length > 0
      ? `Partial workspace data load: components for [${failedDomains.join(", ")}] are currently unavailable.`
      : null;

  const projects = ((results.projectsResult.data ?? []) as unknown[]).map((row) => {
    const record = row as ProjectRecordRow & {
      client: ProjectRecordRow["client"] | ProjectRecordRow["client"][];
      primary_contact:
        | ProjectRecordRow["primary_contact"]
        | ProjectRecordRow["primary_contact"][];
    };

    return {
      ...record,
      client: firstRelation(record.client),
      primary_contact: firstRelation(record.primary_contact),
    };
  });

  const invoices = ((results.invoicesResult.data ?? []) as unknown[]).map((row) => {
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

  const vendorObligations = ((results.vendorObligationsResult.data ?? []) as unknown[]).map(
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

  const documents = ((results.documentsResult.data ?? []) as unknown[]).map((row) => {
    const record = row as DocumentRecordRow & {
      project: DocumentRecordRow["project"] | DocumentRecordRow["project"][];
    };

    return {
      ...record,
      project: firstRelation(record.project),
    };
  });

  const notes = ((results.notesResult.data ?? []) as unknown[]).map((row) => {
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

  const activityEvents = ((results.activityEventsResult.data ?? []) as unknown[]).map(
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
    warning,
    data: {
      studioProfile: results.studioProfileResult.data ?? null,
      projects,
      projectFinanceSummaries: results.projectFinanceSummaryResult.data ?? [],
      projectAttentionItems: results.projectAttentionItemsResult.data ?? [],
      projectAttentionSummaries: results.projectAttentionSummariesResult.data ?? [],
      financeOverview: results.financeOverviewResult.data ?? null,
      dashboardSnapshot: results.dashboardSnapshotResult.data ?? null,
      invoices,
      vendorObligations,
      documents,
      notes,
      activityEvents,
    },
  };
}
