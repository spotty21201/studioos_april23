import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { RestoreProjectButton } from "@/components/forms/restore-project-button";
import { formatCurrencyIdr, formatShortDate } from "@/lib/format";
import { getProjectsPageData } from "@/lib/studio-data";

type ProjectsPageProps = {
  searchParams: Promise<{
    q?: string;
    lifecycle?: string;
    health?: string;
    show_archived?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const showArchived = params.show_archived === "1";
  const projects = await getProjectsPageData({ ...params, showArchived });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Anchor Domain"
        title="Projects"
        description="Projects remain the primary operating record in V1. Finance, documents, notes, and activity all attach here."
        actions={
          <Link
            href="/projects/new"
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Create Project
          </Link>
        }
      />

      <SectionPanel
        title={showArchived ? "Archived Projects" : "Project List"}
        description={
          showArchived
            ? `Viewing ${projects.filteredCount} archived project${projects.filteredCount === 1 ? "" : "s"}. Restore to return them to active work.`
            : `${projects.filteredCount} of ${projects.totalCount} project records shown.`
        }
        action={
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <form className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_170px_170px_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="search"
                  name="q"
                  defaultValue={projects.filters.q}
                  placeholder="Search code, project, or client..."
                  className="h-11 w-full rounded-[2px] border border-border bg-white pl-11 pr-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted"
                />
              </label>
              <select
                name="lifecycle"
                defaultValue={projects.filters.lifecycle}
                className="h-11 rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-border-strong focus:ring-2 focus:ring-border-muted"
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
                className="h-11 rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-border-strong focus:ring-2 focus:ring-border-muted"
              >
                <option value="all">All health states</option>
                <option value="on_track">On track</option>
                <option value="watch">Watch</option>
                <option value="at_risk">At risk</option>
              </select>
              {showArchived ? <input type="hidden" name="show_archived" value="1" /> : null}
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
              >
                Apply
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {showArchived ? (
                <Link
                  href="/projects"
                  className="inline-flex h-11 items-center justify-center rounded-[2px] border border-border bg-white px-4 text-sm font-medium text-text-secondary hover:bg-surface-muted"
                >
                  Hide archived
                </Link>
              ) : (
                <Link
                  href="/projects?show_archived=1"
                  className="inline-flex h-11 items-center justify-center rounded-[2px] border border-border bg-white px-4 text-sm font-medium text-text-secondary hover:bg-surface-muted"
                >
                  Show archived
                </Link>
              )}
              <a
                href="/api/export-projects-xlsx"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
              >
                Export XLSX
              </a>
              <a
                href="/api/export-projects-pdf"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
              >
                Export PDF
              </a>
              <a
                href="/api/export-projects"
                className="inline-flex h-11 items-center px-2 text-sm font-medium text-text-secondary underline-offset-4 hover:text-accent hover:underline"
              >
                Export · CSV
              </a>
            </div>
          </div>
        }
      >
        <div className="overflow-hidden rounded-[8px] border border-border">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-surface-muted text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
              <tr>
                <th className="px-5 py-4 font-medium">Project</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium text-right">Contract</th>
                <th className="px-5 py-4 font-medium text-right">Receivable</th>
                <th className="px-5 py-4 font-medium text-right">Payable</th>
                <th className="px-5 py-4 font-medium text-right">Attention</th>
                <th className="px-5 py-4 font-medium">Updated</th>
                {showArchived ? <th className="px-5 py-4 font-medium text-right">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted bg-white">
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
                      {project.isArchived ? (
                        <span className="inline-flex h-6 items-center rounded-[2px] border border-text-tertiary/40 bg-surface-muted px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary">
                          Archived
                        </span>
                      ) : null}
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
                  {showArchived ? (
                    <td className="px-5 py-4 text-right">
                      <RestoreProjectButton projectId={project.id} />
                    </td>
                  ) : null}
                </tr>
              ))}
              {projects.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={showArchived ? 9 : 8}
                    className="px-5 py-8 text-center text-sm text-text-secondary"
                  >
                    {showArchived
                      ? "No archived projects found."
                      : "No projects match the current filter set."}
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
