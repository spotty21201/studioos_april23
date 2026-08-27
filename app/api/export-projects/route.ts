import { loadProjectExportRows } from "@/lib/export/export-data";
import { mapProjectExportRow, PROJECT_EXPORT_HEADERS } from "@/lib/export/export-helpers";
import { getExportDenialResponse } from "@/lib/export/export-auth";
import { getGeneratedAt } from "@/lib/xlsx/projects-export";

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
    const projects = await loadProjectExportRows();
    const rows = projects.map(mapProjectExportRow);
    // Prepend a "Generated: <ISO+07:00>" metadata row for parity with the
    // XLSX and PDF exports. Padded to the header column count.
    const meta = [
      getGeneratedAt(),
      ...Array(PROJECT_EXPORT_HEADERS.length - 1).fill(""),
    ];
    const content = [meta, PROJECT_EXPORT_HEADERS, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const timestamp = new Date().toISOString().slice(0, 10);

    return new Response(content, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="studioos-projects-${timestamp}.csv"`,
      },
    });
  } catch (err: unknown) {
    console.error("[Export Projects CSV] failed:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected failure generating report.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
