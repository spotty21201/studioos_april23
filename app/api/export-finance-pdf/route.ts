import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { FinancePdfDocument } from "@/lib/pdf/build-finance-pdf";
import { formatFinancePdfFilename } from "@/lib/pdf/format";
import { loadInvoiceExportRows } from "@/lib/export/export-data";
import { mapInvoiceExportRow } from "@/lib/export/export-helpers";
import { getExportDenialResponse } from "@/lib/export/export-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const denied = await getExportDenialResponse();
  if (denied) return denied as NextResponse;
  try {
    const invoices = await loadInvoiceExportRows();
    const rows = invoices.map(mapInvoiceExportRow);
    const doc = createElement(FinancePdfDocument, { rows });
    const buf = await renderToBuffer(doc as unknown as Parameters<typeof renderToBuffer>[0]);

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${formatFinancePdfFilename()}"`,
      },
    });
  } catch (err: unknown) {
    console.error("[Export Finance PDF] failed:", err);
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected failure generating PDF.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}