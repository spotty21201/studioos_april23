import { describe, it, expect, vi } from "vitest";
import { getDashboardPageData } from "../../lib/studio-data";

vi.mock("@/lib/supabase/queries", () => ({
  getStudioOsSource: async () => ({
    source: "local_preview" as const,
    warning: null,
    data: {
      projects: [
        {
          id: "proj-1",
          project_code: "HDA-26001",
          name: "Lippo Pekanbaru 36 ha",
          slug: "lippo-pekanbaru-36-ha",
          client_id: "client-1",
          primary_contact_id: null,
          lifecycle_status: "active",
          health_status: "watch",
          summary: null,
          location: null,
          start_date: null,
          target_end_date: null,
          completed_at: null,
          contract_value: 125000000,
          currency: "IDR",
          project_owner_id: null,
          last_reviewed_at: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
          created_by: null,
          updated_by: null,
          client: { id: "client-1", name: "PT Lippo Karawaci Tbk" },
          primary_contact: null,
          project_owner: null,
        },
        {
          id: "proj-3",
          project_code: "HDA-26003",
          name: "Lippo Cikao 20 ha",
          slug: "lippo-cikao-20-ha",
          client_id: "client-1",
          primary_contact_id: null,
          lifecycle_status: "on_hold",
          health_status: "at_risk",
          summary: null,
          location: null,
          start_date: null,
          target_end_date: null,
          completed_at: null,
          contract_value: 95000000,
          currency: "IDR",
          project_owner_id: null,
          last_reviewed_at: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
          created_by: null,
          updated_by: null,
          client: { id: "client-1", name: "PT Lippo Karawaci Tbk" },
          primary_contact: null,
          project_owner: null,
        },
        {
          id: "proj-5",
          project_code: "HDA-26005",
          name: "YPT Purwokerto 30 ha",
          slug: "ypt-purwokerto-30-ha",
          client_id: "client-2",
          primary_contact_id: null,
          lifecycle_status: "completed",
          health_status: "on_track",
          summary: null,
          location: null,
          start_date: null,
          target_end_date: null,
          completed_at: "2026-04-01T00:00:00Z",
          contract_value: 110000000,
          currency: "IDR",
          project_owner_id: null,
          last_reviewed_at: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-04-01T00:00:00Z",
          created_by: null,
          updated_by: null,
          client: { id: "client-2", name: "Yayasan Pendidikan Telkom" },
          primary_contact: null,
          project_owner: null,
        },
      ],
      projectFinanceSummaries: [],
      projectAttentionSummaries: [],
      projectAttentionItems: [],
      financeOverview: { outstanding_receivable: 0 },
      dashboardSnapshot: { active_projects: 1, projects_needing_attention: 1 },
      invoices: [],
      vendorObligations: [],
      notes: [],
      activityEvents: [],
      studioProfile: { studio_name: "HDA" },
    },
  }),
}));

describe("Dashboard Data Reconciled Semantics (lib/studio-data.ts)", () => {
  it("includes strictly active projects (excluding on_hold and completed) in activeProjects collection", async () => {
    const dashboardData = await getDashboardPageData();

    // Verify only active projects are present in activeProjects
    expect(dashboardData.activeProjects).toHaveLength(1);
    expect(dashboardData.activeProjects[0].id).toBe("proj-1");
    expect(dashboardData.activeProjects[0].lifecycleStatus).toBe("active");

    // Explicitly verify on_hold and completed projects are excluded
    const excludedStatuses = dashboardData.activeProjects.filter(
      (p) => p.lifecycleStatus === "on_hold" || p.lifecycleStatus === "completed",
    );
    expect(excludedStatuses).toHaveLength(0);
  });

  it("exposes operational metric notes for active projects and attention", async () => {
    const dashboardData = await getDashboardPageData();
    const activeProjectsMetric = dashboardData.metrics.find((m) => m.key === "active_projects");
    const attentionMetric = dashboardData.metrics.find((m) => m.key === "projects_needing_attention");

    expect(activeProjectsMetric?.note).toBe("Projects with active lifecycle status");
    expect(attentionMetric?.note).toBe("Distinct projects requiring leadership review");
  });
});
