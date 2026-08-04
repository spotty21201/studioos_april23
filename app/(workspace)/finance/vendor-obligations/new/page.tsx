import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { VendorObligationForm } from "@/components/forms/vendor-obligation-form";
import { getStudioFormOptions } from "@/lib/studio-form-data";

type NewVendorObligationPageProps = {
  searchParams: Promise<{ projectId?: string }>;
};

export default async function NewVendorObligationPage({
  searchParams,
}: NewVendorObligationPageProps) {
  const [{ projectId }, options] = await Promise.all([
    searchParams,
    getStudioFormOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payments"
        title="Record Vendor Payment"
        description="Record a bill or payment that the studio owes to a vendor."
        actions={
          <Link
            href="/finance"
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-white px-5 text-sm font-medium text-black hover:bg-surface-muted"
          >
            Back to Finance
          </Link>
        }
      />

      {options.warning ? (
        <DataSourceNotice title="Form data notice" message={options.warning} />
      ) : null}

      <SectionPanel
        title="Vendor Payment"
        description="Choose a vendor, or enter a new vendor if they are not listed yet."
      >
        <VendorObligationForm options={options} defaultProjectId={projectId} />
      </SectionPanel>
    </div>
  );
}
