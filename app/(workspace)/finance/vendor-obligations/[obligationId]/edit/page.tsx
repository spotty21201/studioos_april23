import Link from "next/link";
import { notFound } from "next/navigation";
import { VendorObligationForm } from "@/components/forms/vendor-obligation-form";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { getVendorObligationEditFormData } from "@/lib/studio-form-data";

type EditVendorObligationPageProps = {
  params: Promise<{ obligationId: string }>;
};

export default async function EditVendorObligationPage({
  params,
}: EditVendorObligationPageProps) {
  const { obligationId } = await params;
  const data = await getVendorObligationEditFormData(obligationId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={data.obligation.vendor?.name ?? "Vendor obligation"}
        title="Edit Vendor Obligation"
        description="Update a project vendor commitment or payable record."
        actions={
          <Link
            href={`/projects/${data.obligation.project_id}`}
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
          >
            Back to Project
          </Link>
        }
      />

      {data.options.warning ? (
        <DataSourceNotice title="Form data notice" message={data.options.warning} />
      ) : null}

      <SectionPanel
        title="Vendor Obligation"
        description="V1 edits stay limited to vendor, amount, status, dates, tax, and notes."
      >
        <VendorObligationForm
          mode="edit"
          options={data.options}
          obligation={data.obligation}
        />
      </SectionPanel>
    </div>
  );
}
