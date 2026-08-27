import { loadInvoiceExportRows } from "@/lib/export/export-data";
import { mapInvoiceExportRow, FINANCE_EXPORT_HEADERS } from "@/lib/export/export-helpers";
import { getExportDenialResponse } from "@/lib/export/export-auth";
import { getGeneratedAt } from "@/lib/xlsx/finance-export";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const denied = await getExportDenialResponse();
  if (denied) return denied;
  try {
    const invoices = await loadInvoiceExportRows();
    const rows = invoices.map(mapInvoiceExportRow);
    // Prepend a "Generated: <ISO+07:00>" metadata row for parity with the
    // XLSX and PDF exports. Padded to the header column count.
    const meta = [
      getGeneratedAt(),
      ...Array(FINANCE_EXPORT_HEADERS.length - 1).fill(""),
    ];
    const content = [meta, FINANCE_EXPORT_HEADERS, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const timestamp = new Date().toISOString().slice(0, 10);

    return new Response(content, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="studioos-finance-${timestamp}.csv"`,
      },
    });
  } catch (err: unknown) {
    console.error("[Export Finance CSV] failed:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected failure generating report.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
