type BadgeTone = "neutral" | "info" | "positive" | "warning" | "critical";

const styleMap: Record<
  BadgeTone,
  { dot: string; text: string; surface: string; border: string }
> = {
  info: {
    dot: "bg-text-primary",
    text: "text-text-primary",
    surface: "bg-surface-muted",
    border: "border-border",
  },
  warning: {
    dot: "bg-warning",
    text: "text-warning",
    surface: "bg-warning-soft",
    border: "border-border",
  },
  neutral: {
    dot: "bg-text-tertiary",
    text: "text-text-secondary",
    surface: "bg-surface-muted",
    border: "border-border",
  },
  positive: {
    dot: "bg-success",
    text: "text-success",
    surface: "bg-success-soft",
    border: "border-border",
  },
  critical: {
    dot: "bg-critical",
    text: "text-critical",
    surface: "bg-critical-soft",
    border: "border-border",
  },
};

type StatusBadgeProps = {
  value: string;
  tone?: BadgeTone;
};

// Tone mapping for every internal enum value to a visible color
const toneByValue: Record<string, BadgeTone> = {
  active: "info",
  proposal: "neutral",
  on_hold: "warning",
  completed: "positive",
  cancelled: "critical",
  on_track: "positive",
  watch: "warning",
  at_risk: "critical",
  draft: "neutral",
  issued: "info",
  paid: "positive",
  overdue: "critical",
  planned: "neutral",
  due: "warning",
  contract: "info",
  client_document: "neutral",
  deliverable: "positive",
  support_document: "neutral",
  invoice_attachment: "warning",
  vendor_attachment: "warning",
  file: "neutral",
  external_link: "info",
  meeting_note: "neutral",
  agreement: "info",
  issue: "critical",
  reminder: "warning",
  follow_up: "warning",
  decision: "positive",
  needs_attention: "critical",
  overdue_invoice: "warning",
  unpaid_vendor: "warning",
  stale_review: "neutral",
  project: "info",
  invoice: "warning",
  vendor_obligation: "critical",
  document: "info",
  note: "neutral",
  connected: "positive",
  not_configured: "warning",
  not_applicable: "neutral",
};

// Human-readable labels for enum values — replaces ALL database-style enums
const displayLabels: Record<string, string> = {
  active: "Active",
  proposal: "Proposal",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
  on_track: "On track",
  watch: "Needs a closer look",
  at_risk: "Action needed",
  draft: "Draft",
  issued: "Issued",
  paid: "Paid",
  overdue: "Overdue",
  planned: "Planned",
  due: "Due",
  needs_attention: "Flagged for review",
  overdue_invoice: "Invoice overdue",
  unpaid_vendor: "Payment pending",
  stale_review: "Not reviewed recently",
  contract: "Contract",
  client_document: "Client document",
  deliverable: "Deliverable",
  support_document: "Supporting document",
  invoice_attachment: "Invoice attachment",
  vendor_attachment: "Vendor attachment",
  file: "Stored file",
  external_link: "Web link",
  meeting_note: "Meeting note",
  agreement: "Agreement",
  issue: "Issue",
  reminder: "Reminder",
  follow_up: "Follow up",
  decision: "Decision",
  project: "Project",
  invoice: "Invoice",
  vendor_obligation: "Vendor payment",
  document: "Document",
  note: "Note",
  connected: "Connected",
  not_configured: "Not configured",
  not_applicable: "Not applicable",
};

function toLabel(value: string) {
  return displayLabels[value] ?? value;
}

export function StatusBadge({ value, tone }: StatusBadgeProps) {
  const resolvedTone = tone ?? toneByValue[value] ?? "neutral";
  const style = styleMap[resolvedTone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[2px] border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase ${style.surface} ${style.border} ${style.text}`}
      aria-label={toLabel(value)}
      role="status"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {toLabel(value)}
    </span>
  );
}
