import { loadInvoiceExportRows } from "@/lib/export/export-data";
import { mapInvoiceExportRow } from "@/lib/export/export-helpers";
import { buildFinanceWorkbook, formatFinanceFilename } from "@/lib/xlsx/finance-export";

export async function GET() {
  try {
    const invoices = await loadInvoiceExportRows();
    const rows = invoices.map(mapInvoiceExportRow);
    const workbook = buildFinanceWorkbook(rows);
    const buffer = await workbook.xlsx.writeBuffer();

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
