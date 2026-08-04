import { describe, it, expect } from "vitest";

describe("Human-readable attention descriptions avoid database terminology", () => {
  // These strings come from studio-data.ts humanizeAttentionSummary descriptions
  const descriptions = [
    "This project needs a closer look.",
    "This project is at risk.",
    "This project has not been reviewed recently.",
  ];

  it.each(descriptions)("'%s' does not contain DB jargon", (desc) => {
    expect(desc.toLowerCase()).not.toContain("health status");
    expect(desc.toLowerCase()).not.toContain("lifecycle");
    expect(desc.toLowerCase()).not.toContain("institutional memory");
  });
});
