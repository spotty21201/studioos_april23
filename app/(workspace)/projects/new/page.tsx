import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { ProjectForm } from "@/components/forms/project-form";
import { getStudioFormOptions } from "@/lib/studio-form-data";

export default async function NewProjectPage() {
  const options = await getStudioFormOptions();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Project Setup"
        title="Create Project"
        description="Add the core project record first. Finance, documents, notes, and activity attach to this project after creation."
        actions={
          <Link
            href="/projects"
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
          >
            Back to Projects
          </Link>
        }
      />

      {options.warning ? (
        <DataSourceNotice title="Form data notice" message={options.warning} />
      ) : null}

      <SectionPanel
        title="Project Record"
        description="Required fields are limited to project identity, client, status, and contract value."
      >
        <ProjectForm mode="create" options={options} />
      </SectionPanel>
    </div>
  );
}
