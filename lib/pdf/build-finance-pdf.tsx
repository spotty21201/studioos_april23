import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getGeneratedAt } from "@/lib/xlsx/finance-export";
import { FINANCE_EXPORT_HEADERS } from "@/lib/export/export-helpers";
import { PDF_FONT_FAMILY, registerPdfFonts } from "@/lib/pdf/font-loader";

// Registers PT Sans on first import so the font travels with the bundle.
registerPdfFonts();

// Right-align the three monetary columns:
//   Amount (IDR)      index 6
//   Tax %             index 7
//   Tax Amount (IDR)  index 8
const RIGHT_ALIGNED_COLUMNS = new Set<number>([6, 7, 8]);

// Per-column flex weights. Higher = wider. Text-heavy columns (Project,
// Title) get more room than codes/dates so that data never has to wrap
// aggressively.
const COLUMN_WEIGHTS = [
  1.8, // Project
  1.2, // Invoice Number
  2.2, // Title
  1.0, // Issued Date
  1.0, // Due Date
  1.0, // Paid Date
  1.3, // Amount (IDR)
  0.7, // Tax %
  1.2, // Tax Amount (IDR)
  1.0, // Status
];

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 8,
    padding: 36,
    color: "#1F2428",
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E7EB",
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2428",
    marginBottom: 4,
  },
  generated: {
    fontSize: 9,
    color: "#68707A",
  },
  totalLine: {
    fontSize: 9,
    color: "#68707A",
    marginTop: 4,
  },
  table: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E4E7EB",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#2F5E7A",
    color: "#FFFFFF",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 9,
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 5,
    flexGrow: 0,
    flexBasis: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E4E7EB",
  },
  tableRowZebra: {
    backgroundColor: "#F7F6F3",
  },
  tableCell: {
    fontSize: 8,
    color: "#1F2428",
    paddingVertical: 4,
    paddingHorizontal: 5,
    flexGrow: 0,
    flexBasis: 0,
  },
  tableCellRight: {
    textAlign: "right",
  },
});

interface FinancePdfDocumentProps {
  rows: string[][];
}

function cellStyleFor(colIdx: number, header: boolean) {
  const base = header ? styles.tableHeaderCell : styles.tableCell;
  const align = (header || RIGHT_ALIGNED_COLUMNS.has(colIdx))
    ? styles.tableCellRight
    : undefined;
  return [
    base,
    { flexGrow: COLUMN_WEIGHTS[colIdx] },
    ...(align ? [align] : []),
  ];
}

export function FinancePdfDocument({ rows }: FinancePdfDocumentProps) {
  return (
    <Document
      title="StudioOS — Finance Report"
      author="HDA StudioOS"
    >
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.title}>StudioOS — Finance Report</Text>
          <Text style={styles.generated}>{getGeneratedAt()}</Text>
          <Text style={styles.totalLine}>Total: {rows.length} rows</Text>
        </View>

        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.tableHeaderRow} fixed>
            {FINANCE_EXPORT_HEADERS.map((header, i) => (
              <Text
                key={`h-${i}`}
                style={cellStyleFor(i, true)}
              >
                {header}
              </Text>
            ))}
          </View>

          {/* Data rows */}
          {rows.map((row, rowIdx) => (
            <View
              key={`r-${rowIdx}`}
              style={[
                styles.tableRow,
                rowIdx % 2 === 1 ? styles.tableRowZebra : undefined,
              ]}
              wrap={false}
            >
              {FINANCE_EXPORT_HEADERS.map((_, colIdx) => {
                const cell = row[colIdx] ?? "";
                return (
                  <Text
                    key={`c-${rowIdx}-${colIdx}`}
                    style={cellStyleFor(colIdx, false)}
                  >
                    {cell}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}