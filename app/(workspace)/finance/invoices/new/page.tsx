import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getStudioFormOptions } from "@/lib/studio-form-data";

type NewInvoicePageProps = {
  searchParams: Promise<{ projectId?: string }>;
};

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
  const [{ projectId }, options] = await Promise.all([
    searchParams,
    getStudioFormOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Receivables"
        title="Create Invoice"
        description="Add an invoice and connect it to the right project."
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
        title="Invoice Record"
        description="Add a tax percentage if tax applies. The tax amount will be calculated automatically."
      >
        <InvoiceForm options={options} defaultProjectId={projectId} />
      </SectionPanel>
    </div>
  );
}
