import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { ProjectForm } from "@/components/forms/project-form";
import { ArchiveProjectSection } from "@/components/ui/archive-project-section";
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
        description="Update the project details, client information, dates, and responsibilities."
        actions={
          <Link
            href={`/projects/${data.project.id}`}
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
          >
            Back to Detail
          </Link>
        }
      />

      {data.options.warning ? (
        <DataSourceNotice title="Form notice" message={data.options.warning} />
      ) : null}

      <SectionPanel
        title="Project Record"
        description="Update the project status, dates, ownership, and current context."
      >
        <ProjectForm mode="edit" options={data.options} project={data.project} />
      </SectionPanel>

      <ArchiveProjectSection
        projectId={data.project.id}
        projectName={data.project.name}
      />
    </div>
  );
}
