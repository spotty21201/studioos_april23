// Shared helpers for PDF route handlers.
// `formatPdfDate` produces "YYYY-MM-DD" from `new Date()`.
// `formatProjectsPdfFilename` / `formatFinancePdfFilename` produce the
// standard download filenames used by the route handlers.

export function formatPdfDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatProjectsPdfFilename(): string {
  return `studioos-projects-${formatPdfDate()}.pdf`;
}

export function formatFinancePdfFilename(): string {
  return `studioos-finance-${formatPdfDate()}.pdf`;
}