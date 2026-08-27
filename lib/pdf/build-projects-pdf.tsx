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
// Numeric / monetary columns: Contract Value (8) + Owner/Lead not numeric —
// We right-align the single Contract Value column for Projects per
// Design.md ("right-aligned numeric columns").
const RIGHT_ALIGNED_COLUMNS = new Set<number>([8]);

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 9,
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
    fontSize: 11,
    color: "#FFFFFF",
    padding: 6,
    flexGrow: 1,
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
    fontSize: 9,
    color: "#1F2428",
    padding: 6,
    flexGrow: 1,
    flexBasis: 0,
  },
  tableCellRight: {
    textAlign: "right",
  },
});

interface ProjectsPdfDocumentProps {
  rows: string[][];
}

export function ProjectsPdfDocument({ rows }: ProjectsPdfDocumentProps) {
  return (
    <Document
      title="StudioOS — Projects Report"
      author="HDA StudioOS"
    >
      <Page size="A4" orientation="portrait" style={styles.page} wrap>
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
                style={[
                  styles.tableHeaderCell,
                  RIGHT_ALIGNED_COLUMNS.has(i) ? styles.tableCellRight : undefined,
                ]}
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
              {PROJECT_EXPORT_HEADERS.map((_, colIdx) => {
                const cell = row[colIdx] ?? "";
                return (
                  <Text
                    key={`c-${rowIdx}-${colIdx}`}
                    style={[
                      styles.tableCell,
                      RIGHT_ALIGNED_COLUMNS.has(colIdx) ? styles.tableCellRight : undefined,
                    ]}
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