import { loadProjectExportRows } from "@/lib/export/export-data";
import { mapProjectExportRow } from "@/lib/export/export-helpers";
import { buildProjectsWorkbook, formatProjectsFilename } from "@/lib/xlsx/projects-export";

export async function GET(): Promise<Response> {
  try {
    const projects = await loadProjectExportRows();
    const rows = projects.map(mapProjectExportRow);
    const workbook = buildProjectsWorkbook(rows);
    const buf = await workbook.xlsx.writeBuffer();

    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${formatProjectsFilename()}"`,
      },
    });
  } catch (err: unknown) {
    console.error("[Export Projects XLSX] failed:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected failure generating report.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
