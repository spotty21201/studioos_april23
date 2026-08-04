import writeXlsxFile from "write-excel-file/node";
import type { SheetData, SheetOptions } from "write-excel-file/node";
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

// Builds an `.xlsx` workbook Buffer with a styled header row, wrapped data
// rows, and auto-sized column widths. Uses `write-excel-file`, which pulls
// in no deprecated transitive dependencies (unlike `exceljs`).
export async function buildFinanceWorkbook(rows: string[][]): Promise<Buffer> {
  const sheetData: SheetData = [];

  // Header row
  sheetData.push(
    FINANCE_HEADERS.map((header) => ({
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
  const columns: NonNullable<SheetOptions<unknown>["columns"]> = FINANCE_HEADERS.map(
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
    sheet: "Finance",
    columns,
  });
  return file.toBuffer();
}
