import writeXlsxFile from "write-excel-file/node";
import type { SheetData, SheetOptions } from "write-excel-file/node";
import {
  mapProjectExportRow,
  PROJECT_EXPORT_HEADERS,
  type ProjectExportRow,
} from "@/lib/export/export-helpers";

export type ProjectData = ProjectExportRow;

export const PROJECT_HEADERS = PROJECT_EXPORT_HEADERS;

export function formatTimestamp(): string {
  return new Date().toISOString().slice(0, 10);
}

// Returns the export timestamp in ISO 8601 with the Asia/Jakarta (+07:00)
// timezone offset, e.g. "Generated: 2026-08-27T14:35:00+07:00".
// Uses `sv-SE` locale for stable YYYY-MM-DD HH:mm:ss formatting, then
// appends the fixed +07:00 offset (Asia/Jakarta does not observe DST).
export function getGeneratedAt(): string {
  const local = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" });
  // `sv-SE` produces "YYYY-MM-DD HH:mm:ss" (space-separated).
  return `Generated: ${local.replace(" ", "T")}+07:00`;
}

export function formatProjectsFilename(): string {
  return `studioos-projects-${formatTimestamp()}.xlsx`;
}

export function mapProjectRow(p: ProjectData): string[] {
  return mapProjectExportRow(p);
}

export function isProjectActive(project: unknown): boolean {
  if (typeof project !== "object" || project === null) return false;
  const obj = project as Record<string, unknown>;
  const val = obj.is_archived;
  // Return true ONLY for non-archived projects (or missing flag = treat as not archived)
  return val === undefined || val === null || !Boolean(val);
}

// Builds an `.xlsx` workbook Buffer with a styled header row, wrapped data
// rows, and auto-sized column widths. Uses `write-excel-file`, which pulls
// in no deprecated transitive dependencies (unlike `exceljs`).
export async function buildProjectsWorkbook(rows: string[][]): Promise<Buffer> {
  const sheetData: SheetData = [];

  // Metadata row (row 0): "Generated: <ISO>" merged across all columns.
  // `columnSpan` combines this cell with the next N-1 cells visually.
  const metadataRow: SheetData[number] = [
    {
      value: getGeneratedAt(),
      fontWeight: "bold" as const,
      backgroundColor: "#F3F4F6",
      columnSpan: PROJECT_HEADERS.length,
    },
  ];
  for (let i = 1; i < PROJECT_HEADERS.length; i++) {
    metadataRow.push(null);
  }
  sheetData.push(metadataRow);

  // Header row (row 1)
  sheetData.push(
    PROJECT_HEADERS.map((header) => ({
      value: header,
      fontWeight: "bold" as const,
      backgroundColor: "#F3F4F6",
      height: 36,
    })),
  );

  // Data rows
  for (const row of rows) {
    sheetData.push(
      row.map((cell) => ({
        value: cell,
        wrap: true,
        alignVertical: "top" as const,
        height: 72,
      })),
    );
  }

  // Auto-width columns
  const columns: NonNullable<SheetOptions<unknown>["columns"]> = PROJECT_HEADERS.map(
    (header, index) => {
      let maxWidth = header.length + 4;
      for (const row of rows) {
        const cell = row[index];
        if (cell != null && cell.length > maxWidth - 2) {
          maxWidth = cell.length + 2;
        }
      }
      return { width: Math.min(maxWidth, 50) };
    },
  );

  const file = writeXlsxFile(sheetData, {
    sheet: "Projects",
    columns,
  });
  return file.toBuffer();
}
