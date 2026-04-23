import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrencyIdr, formatShortDate } from "@/lib/format";
import { getProjectsPageData } from "@/lib/studio-data";

type ProjectsPageProps = {
  searchParams: Promise<{
    q?: string;
    lifecycle?: string;
    health?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const projects = await getProjectsPageData(params);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Anchor Domain"
        title="Projects"
        description="Projects remain the primary operating record in V1. Finance, documents, notes, and activity all attach here."
        actions={
          <Link
            href="/projects/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Create Project
          </Link>
        }
      />

      <SectionPanel
        title="Project List"
        description={`${projects.filteredCount} of ${projects.totalCount} project records shown.`}
        action={
          <form className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_180px_180px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                type="search"
                name="q"
                defaultValue={projects.filters.q}
                placeholder="Search code, project, or client..."
                className="h-11 w-full rounded-full border border-border bg-white pl-11 pr-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent/35 focus:ring-4 focus:ring-accent/8"
              />
            </label>
            <select
              name="lifecycle"
              defaultValue={projects.filters.lifecycle}
              className="h-11 rounded-full border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-accent/35 focus:ring-4 focus:ring-accent/8"
            >
              <option value="all">All lifecycle states</option>
              <option value="proposal">Proposal</option>
              <option value="active">Active</option>
              <option value="on_hold">On hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              name="health"
              defaultValue={projects.filters.health}
              className="h-11 rounded-full border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-accent/35 focus:ring-4 focus:ring-accent/8"
            >
              <option value="all">All health states</option>
              <option value="on_track">On track</option>
              <option value="watch">Watch</option>
              <option value="at_risk">At risk</option>
            </select>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-strong"
            >
              Apply
            </button>
          </form>
        }
      >
        <div className="overflow-hidden rounded-[22px] border border-border/80">
          <table className="min-w-full divide-y divide-border/80 text-left">
            <thead className="bg-surface-muted/70 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
              <tr>
                <th className="px-5 py-4 font-medium">Project</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium text-right">Contract</th>
                <th className="px-5 py-4 font-medium text-right">Receivable</th>
                <th className="px-5 py-4 font-medium text-right">Payable</th>
                <th className="px-5 py-4 font-medium text-right">Attention</th>
                <th className="px-5 py-4 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 bg-white/75">
              {projects.items.map((project) => (
                <tr key={project.id} className="align-top">
                  <td className="px-5 py-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-semibold text-text-primary hover:text-accent"
                    >
                      {project.projectCode}
                    </Link>
                    <p className="mt-1 text-sm text-text-secondary">{project.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge value={project.lifecycleStatus} />
                      <StatusBadge value={project.healthStatus} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {project.clientName}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                    {formatCurrencyIdr(project.contractValue.amount)}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                    {formatCurrencyIdr(project.outstandingReceivable.amount)}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-text-primary">
                    {formatCurrencyIdr(project.outstandingPayable.amount)}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-text-secondary">
                    {project.attentionCount}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {formatShortDate(project.updatedAt)}
                  </td>
                </tr>
              ))}
              {projects.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-sm text-text-secondary"
                  >
                    No projects match the current filter set.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionPanel>
    </div>
  );
}
