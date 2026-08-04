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

  // Header row
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
