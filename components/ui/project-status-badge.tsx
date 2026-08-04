type ProjectStatusBadgeProps = {
  lifecycleValue: string;
  healthValue: string;
};

export function ProjectStatusBadge({ lifecycleValue, healthValue }: ProjectStatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] leading-relaxed">
      {displayLabel(lifecycleValue)}
      <span className="text-text-tertiary" aria-hidden="true">·</span>
      <span className="text-text-secondary">{displayLabel(healthValue)}</span>
    </span>
  );
}

function displayLabel(value: string): string {
  const labels: Record<string, string> = {
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
  };
  return labels[value] ?? value;
}
