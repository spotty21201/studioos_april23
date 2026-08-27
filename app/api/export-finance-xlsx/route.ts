import { loadInvoiceExportRows } from "@/lib/export/export-data";
import { mapInvoiceExportRow } from "@/lib/export/export-helpers";
import { getExportDenialResponse } from "@/lib/export/export-auth";
import { buildFinanceWorkbook, formatFinanceFilename } from "@/lib/xlsx/finance-export";

export async function GET() {
  const denied = await getExportDenialResponse();
  if (denied) return denied;
  try {
    const invoices = await loadInvoiceExportRows();
    const rows = invoices.map(mapInvoiceExportRow);
    const buffer = await buildFinanceWorkbook(rows);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${formatFinanceFilename()}"`,
      },
    });
  } catch (err: unknown) {
    console.error("[Export Finance XLSX] failed:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected failure generating report.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
