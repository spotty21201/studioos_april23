import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { ProjectForm } from "@/components/forms/project-form";
import { getProjectEditFormData } from "@/lib/studio-form-data";

type EditProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { projectId } = await params;
  const data = await getProjectEditFormData(projectId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={data.project.project_code}
        title="Edit Project"
        description="Update the leadership-facing project record without changing linked finance, documents, or notes."
        actions={
          <Link
            href={`/projects/${data.project.id}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-medium text-text-primary hover:border-border-strong"
          >
            Back to Detail
          </Link>
        }
      />

      {data.options.warning ? (
        <DataSourceNotice title="Form data notice" message={data.options.warning} />
      ) : null}

      <SectionPanel
        title="Project Record"
        description="Primary edits stay focused on project status, dates, ownership, and current context."
      >
        <ProjectForm mode="edit" options={data.options} project={data.project} />
      </SectionPanel>
    </div>
  );
}
