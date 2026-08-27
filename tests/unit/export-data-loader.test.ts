import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Regression test for the E1 fix: owner/lead columns must be requested
// from Supabase in the same single base select() call. The previous
// implementation issued a separate follow-up select("id, project_owner_name,
// project_lead_name") and silently no-op'd on error, which left owner/lead
// blank in the XLSX/CSV exports.
//
// We assert on the source file as a string (no DB mocking) to keep the
// contract locked down: the columns must appear in the first .select(...)
// call against the "projects" table.
describe("export-data loader — owner/lead in single base query", () => {
  const source = readFileSync(
    resolve(process.cwd(), "lib/export/export-data.ts"),
    "utf8",
  );

  it("requests project_owner_name and project_lead_name in the base projects select", () => {
    const projectsSelect = source.match(/from\("projects"\)\s*\.select\(\s*([`"][\s\S]*?[`"])\s*\)/);
    expect(projectsSelect, "expected a single from(\"projects\").select(...) call in loadProjectExportRows").not.toBeNull();

    const selectBody = projectsSelect![1];
    expect(selectBody).toContain("project_owner_name");
    expect(selectBody).toContain("project_lead_name");
  });

  it("does not issue a second projects select just to fetch owner/lead", () => {
    // Count .select(...) calls against "projects" in loadProjectExportRows
    // (we look at the whole module — there is only one such function).
    const selectCalls = source.match(/from\("projects"\)\s*\.select\(/g) ?? [];
    expect(selectCalls.length).toBe(1);
  });
});