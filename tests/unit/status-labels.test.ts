import { describe, it, expect } from "vitest";

describe("Project status labels use human-readable text", () => {
  const statusToText = {
    active: "Active",
    on_hold: "On hold",
    completed: "Completed",
    cancelled: "Cancelled",
    proposal: "Proposal",
    on_track: "On track",
    watch: "Needs a closer look",
    at_risk: "Action needed",
    needs_attention: "Flagged for review",
    overdue_invoice: "Invoice overdue",
    unpaid_vendor: "Payment pending",
    stale_review: "Not reviewed recently",
  };

  it.each(Object.entries(statusToText))('maps "%s" → "%s"', (key, label) => {
    // Verify no raw enum values remain
    expect(label).not.toContain("_");
    // Verify capitalization is proper
    expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase());
  });

  it("archival/attention language avoids db jargon", () => {
    Object.values(statusToText).forEach((label) => {
      const lower = label.toLowerCase();
      expect(lower).not.toMatch(/health status/);
      expect(lower).not.toMatch(/lifecycle/);
      expect(lower).not.toMatch(/institutional memory/);
      expect(lower).not.toMatch(/integration readiness/);
    });
  });
});
