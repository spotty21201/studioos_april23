import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ProjectsPdfDocument } from "@/lib/pdf/build-projects-pdf";
import { formatProjectsPdfFilename } from "@/lib/pdf/format";
import { loadProjectExportRows } from "@/lib/export/export-data";
import { mapProjectExportRow } from "@/lib/export/export-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const projects = await loadProjectExportRows();
    const rows = projects.map(mapProjectExportRow);
    const doc = createElement(ProjectsPdfDocument, { rows });
    const buf = await renderToBuffer(doc as unknown as Parameters<typeof renderToBuffer>[0]);

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${formatProjectsPdfFilename()}"`,
      },
    });
  } catch (err: unknown) {
    console.error("[Export Projects PDF] failed:", err);
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected failure generating PDF.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}