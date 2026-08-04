import ExcelJS from "exceljs";
import {
  mapInvoiceExportRow,
  FINANCE_EXPORT_HEADERS,
  type InvoiceExportRow,
} from "@/lib/export/export-helpers";

export type InvoiceData = InvoiceExportRow;

export const FINANCE_HEADERS = FINANCE_EXPORT_HEADERS;

export function formatTimestamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatFinanceFilename(): string {
  return `studioos-finance-${formatTimestamp()}.xlsx`;
}

export function mapInvoiceRow(inv: InvoiceData): string[] {
  return mapInvoiceExportRow(inv);
}

function applyHeaderStyle(cell: ExcelJS.Cell) {
  cell.font = { bold: true };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3F4F6" },
  };
}

export function buildFinanceWorkbook(rows: string[][]): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Finance");

  // Header row
  const headerRow = worksheet.getRow(1);
  FINANCE_HEADERS.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    applyHeaderStyle(cell);
  });
  headerRow.height = 36;

  // Data rows
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const worksheetRow = worksheet.addRow(row);
    worksheetRow.height = 72;

    // Apply text wrap to all cells in this row
    for (let colIndex = 1; colIndex <= row.length; colIndex++) {
      worksheetRow.getCell(colIndex).alignment = { vertical: "top", wrapText: true };
    }
  }

  // Auto-width columns
  for (let colIndex = 1; colIndex <= FINANCE_HEADERS.length; colIndex++) {
    let maxWidth = FINANCE_HEADERS[colIndex - 1].length + 4;
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
