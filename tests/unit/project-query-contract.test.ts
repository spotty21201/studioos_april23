import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const querySource = readFileSync(
  new URL("../../lib/supabase/queries.ts", import.meta.url),
  "utf8",
);

describe("project query display contract", () => {
  it("retrieves saved ownership names and archive state", () => {
    expect(querySource).toMatch(
      /from\("projects"\)\.select\(`[\s\S]*project_owner_name,[\s\S]*project_lead_name,[\s\S]*is_archived,/,
    );
  });
});
