import { describe, it, expect } from "vitest";

describe("project status badge", () => {
  const labelMap: Record<string, string> = {
    active: "Active",
    proposal: "Proposal",
    on_hold: "On hold",
    completed: "Completed",
    cancelled: "Cancelled",
    on_track: "On track",
    watch: "Needs a closer look",
    at_risk: "Action needed",
  };

  function combineLabels(lifecycle: string, health: string): string {
    return `${labelMap[lifecycle] ?? lifecycle} · ${labelMap[health] ?? health}`;
  }

  it("shows human-readable stage and health combined", () => {
    const result = combineLabels("active", "at_risk");
    expect(result).toBe("Active · Action needed");
    expect(result).not.toContain("_");
    expect(result.toLowerCase()).not.toMatch(/health/);
  });

  it("combines on_hold with Needs a closer look", () => {
    const result = combineLabels("on_hold", "watch");
    expect(result).toBe("On hold · Needs a closer look");
  });

  it("uses dot separator between stage and health", () => {
    const result = combineLabels("active", "on_track");
    expect(result).toContain("·");
  });
});
