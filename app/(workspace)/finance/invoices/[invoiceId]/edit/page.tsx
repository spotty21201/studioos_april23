import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { DataSourceNotice } from "@/components/ui/data-source-notice";
import { PageHeader } from "@/components/ui/page-header";
import { SectionPanel } from "@/components/ui/section-panel";
import { getInvoiceEditFormData } from "@/lib/studio-form-data";

type EditInvoicePageProps = {
  params: Promise<{ invoiceId: string }>;
};

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { invoiceId } = await params;
  const data = await getInvoiceEditFormData(invoiceId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={data.invoice.invoice_number}
        title="Edit Invoice"
        description="Update an operational receivable record without changing the project workflow model."
        actions={
          <Link
            href={`/projects/${data.invoice.project_id}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-medium text-text-primary hover:border-border-strong"
          >
            Back to Project
          </Link>
        }
      />

      {data.options.warning ? (
        <DataSourceNotice title="Form data notice" message={data.options.warning} />
      ) : null}

      <SectionPanel
        title="Invoice Record"
        description="Status, dates, amount, tax, and notes remain the editable V1 fields."
      >
        <InvoiceForm mode="edit" options={data.options} invoice={data.invoice} />
      </SectionPanel>
    </div>
  );
}
