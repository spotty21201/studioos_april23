import { describe, it, expect } from "vitest";
import {
  processStudioOsQueryResults,
  formatDataWarning,
  type RawStudioOsQueryResults,
} from "../../lib/supabase/query-processor";

function buildMockQueryResults(overrides: Partial<RawStudioOsQueryResults> = {}): RawStudioOsQueryResults {
  const defaultSingle = { data: null, error: null };
  const defaultArray = { data: [], error: null };

  return {
    studioProfileResult: defaultSingle,
    projectsResult: {
      data: [
        {
          id: "proj-1",
          project_code: "HDA-101",
          name: "Test Project",
          slug: "hda-101-test",
          client_id: "client-1",
          primary_contact_id: null,
          lifecycle_status: "active",
          health_status: "on_track",
          summary: null,
          location: null,
          start_date: null,
          target_end_date: null,
          completed_at: null,
          contract_value: 100000,
          currency: "IDR",
          project_owner_id: null,
          last_reviewed_at: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
          created_by: null,
          updated_by: null,
          client: { id: "client-1", name: "Client One" },
          primary_contact: null,
          project_owner: null,
        },
      ],
      error: null,
    },
    projectFinanceSummaryResult: defaultArray,
    projectAttentionItemsResult: defaultArray,
    projectAttentionSummariesResult: defaultArray,
    financeOverviewResult: defaultSingle,
    dashboardSnapshotResult: defaultSingle,
    invoicesResult: defaultArray,
    vendorObligationsResult: defaultArray,
    documentsResult: defaultArray,
    notesResult: defaultArray,
    activityEventsResult: defaultArray,
    ...overrides,
  };
}

describe("Production Query Result Processor (lib/supabase/query-processor.ts)", () => {
  it("behaves correctly when all domains succeed", () => {
    const raw = buildMockQueryResults();
    const envelope = processStudioOsQueryResults(raw);

    expect(envelope.source).toBe("supabase");
    expect(envelope.warning).toBeNull();
    expect(envelope.data.projects).toHaveLength(1);
    expect(envelope.data.projects[0].name).toBe("Test Project");
  });

  it("preserves successful live domain data when another domain query fails", () => {
    const raw = buildMockQueryResults({
      invoicesResult: {
        data: null,
        error: { message: "Relation 'invoices' missing or permission denied" },
      },
    });

    const envelope = processStudioOsQueryResults(raw);

    expect(envelope.source).toBe("supabase"); // Never substitutes mock data in configured live mode!
    expect(envelope.data.projects).toHaveLength(1); // Live projects preserved!
    expect(envelope.data.invoices).toEqual([]); // Failed domain returns empty array
    expect(envelope.warning).toContain("invoices");
    expect(envelope.warning).toContain("Partial workspace data load");
  });

  it("identifies multiple failed domains in calm warning notice", () => {
    const raw = buildMockQueryResults({
      invoicesResult: { data: null, error: { message: "Error 1" } },
      documentsResult: { data: null, error: { message: "Error 2" } },
    });

    const envelope = processStudioOsQueryResults(raw);

    expect(envelope.warning).toContain("invoices");
    expect(envelope.warning).toContain("documents");
    expect(envelope.data.projects).toHaveLength(1);
  });

  it("formats top-level data warnings without exposing internal secrets", () => {
    const warningMsg = formatDataWarning(new Error("Could not find the table 'public.profiles' in the schema cache"));
    expect(warningMsg).toContain("schema cache");
    expect(warningMsg).not.toContain("password");
  });
});
