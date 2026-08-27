import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getGeneratedAt } from "@/lib/xlsx/projects-export";
import { PROJECT_EXPORT_HEADERS } from "@/lib/export/export-helpers";
import { PDF_FONT_FAMILY, registerPdfFonts } from "@/lib/pdf/font-loader";

// Registers PT Sans on first import so the font travels with the bundle.
registerPdfFonts();

// Columns that should be right-aligned in the body of the table.
//   Contract Value (IDR) — index 8
const RIGHT_ALIGNED_COLUMNS = new Set<number>([8]);

// Per-column flex weights. Higher = wider. Text-heavy columns get more room
// than short codes/dates so that data never has to wrap aggressively.
const COLUMN_WEIGHTS = [
  1.3, // Project Code
  2.2, // Name
  1.5, // Client
  0.9, // Stage
  1.4, // Health
  1.6, // Location
  1.0, // Start Date
  1.0, // Target End
  1.4, // Contract Value (IDR)
  1.3, // Client Manager
  1.3, // Project Manager
  1.6, // Last Updated
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

interface ProjectsPdfDocumentProps {
  rows: string[][];
}

// Compact an ISO-8601 datetime ("2026-04-22T02:10:00.000Z") to a
// shorter human form ("2026-04-22 02:10") for the narrow "Last Updated"
// cell. Anything else passes through unchanged.
function compactDateTime(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(value);
  if (!match) return value;
  return `${match[1]} ${match[2]}`;
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

export function ProjectsPdfDocument({ rows }: ProjectsPdfDocumentProps) {
  return (
    <Document
      title="StudioOS — Projects Report"
      author="HDA StudioOS"
    >
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.title}>StudioOS — Projects Report</Text>
          <Text style={styles.generated}>{getGeneratedAt()}</Text>
          <Text style={styles.totalLine}>Total: {rows.length} rows</Text>
        </View>

        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.tableHeaderRow} fixed>
            {PROJECT_EXPORT_HEADERS.map((header, i) => (
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
              {PROJECT_EXPORT_HEADERS.map((header, colIdx) => {
                let cell = row[colIdx] ?? "";
                if (colIdx === 11 /* Last Updated */) {
                  cell = compactDateTime(cell);
                }
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