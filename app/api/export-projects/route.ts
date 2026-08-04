import { loadProjectExportRows } from "@/lib/export/export-data";
import { mapProjectExportRow, PROJECT_EXPORT_HEADERS } from "@/lib/export/export-helpers";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  try {
    const projects = await loadProjectExportRows();
    const rows = projects.map(mapProjectExportRow);
    const content = [PROJECT_EXPORT_HEADERS, ...rows]
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
