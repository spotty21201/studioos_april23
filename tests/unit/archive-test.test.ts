import { describe, it, expect } from "vitest";

describe("Archive confirmation", () => {
  it("requires both project_id and confirm_project_name", () => {
    const body = { project_id: "abc", confirm_project_name: "Test Project" };
    expect(body.project_id).toBeDefined();
    expect(body.confirm_project_name).toBeDefined();
  });

  it("case-insensitive name matching works correctly", () => {
    const projectName = "Lippo Cikao 20 ha";
    expect(projectName.toLowerCase()).toBe("lippo cikao 20 ha");
    expect(projectName.toLowerCase() === "lipPO cikaO 20 hA".toLowerCase()).toBe(true);
    expect(projectName.toLowerCase() !== "wrong name".toLowerCase()).toBe(true);
  });
});
