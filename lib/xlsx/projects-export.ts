import ExcelJS from "exceljs";
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

function applyHeaderStyle(cell: ExcelJS.Cell) {
  cell.font = { bold: true };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3F4F6" },
  };
}

export function buildProjectsWorkbook(rows: string[][]): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Projects");

  const headerRow = worksheet.getRow(1);
  PROJECT_HEADERS.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    applyHeaderStyle(cell);
  });
  headerRow.height = 36;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const worksheetRow = worksheet.addRow(row);
    worksheetRow.height = 72;

    for (let colIndex = 1; colIndex <= row.length; colIndex++) {
      worksheetRow.getCell(colIndex).alignment = { vertical: "top", wrapText: true };
    }
  }

  for (let colIndex = 1; colIndex <= PROJECT_HEADERS.length; colIndex++) {
    let maxWidth = PROJECT_HEADERS[colIndex - 1].length + 4;
    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
      const cell = worksheet.getCell(rowIndex, colIndex);
      if (cell.value != null && String(cell.value).length > maxWidth - 2) {
        maxWidth = String(cell.value).length + 2;
      }
    }
    worksheet.getColumn(colIndex).width = Math.min(maxWidth, 50);
  }

  return workbook;
}
