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

// Body-cell alignment by column type.
// Center: short codes, statuses and dates. Right: money. Left: long text.
//   0 Project Code, 3 Stage, 6 Start Date, 7 Target End, 11 Last Updated
const CENTER_ALIGNED_COLUMNS = new Set<number>([0, 3, 6, 7, 11]);
//   8 Contract Value (IDR)
const RIGHT_ALIGNED_COLUMNS = new Set<number>([8]);
// Bold project name body cells (column index 1 = "Name")
const BOLD_COLUMNS = new Set<number>([1]);

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
    padding: 24,
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
    textAlign: "center",
  },
  company: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#68707A",
    textAlign: "center",
    marginTop: 2,
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
  tableCellCenter: {
    textAlign: "center",
  },
  tableCellBold: {
    fontWeight: "bold",
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
  const align = header
    ? styles.tableCellCenter
    : RIGHT_ALIGNED_COLUMNS.has(colIdx)
      ? styles.tableCellRight
      : CENTER_ALIGNED_COLUMNS.has(colIdx)
        ? styles.tableCellCenter
        : undefined;
  const bold =
    !header && BOLD_COLUMNS.has(colIdx) ? styles.tableCellBold : undefined;
  return [
    base,
    { flexGrow: COLUMN_WEIGHTS[colIdx] },
    ...(align ? [align] : []),
    ...(bold ? [bold] : []),
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
          <Text style={styles.company}>HDA</Text>
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