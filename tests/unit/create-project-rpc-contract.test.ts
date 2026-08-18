import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationSql = readFileSync(
  new URL(
    "../../supabase/migrations/20260818000001_fix_create_project_rpc.sql",
    import.meta.url,
  ),
  "utf8",
);

const createActionSource = readFileSync(
  new URL("../../app/(workspace)/actions.ts", import.meta.url),
  "utf8",
);

describe("create_project_with_activity RPC contract", () => {
  it("defines the owner-name arguments sent by the project Server Action", () => {
    for (const argument of ["p_project_owner_name", "p_project_lead_name"]) {
      expect(createActionSource).toContain(`${argument}:`);
      expect(migrationSql).toMatch(new RegExp(`${argument}\\s+text\\s+default\\s+null`, "i"));
    }
  });

  it("removes the obsolete owner-id signature and reloads the schema cache", () => {
    expect(migrationSql).toMatch(
      /drop function if exists public\.create_project_with_activity\([\s\S]*uuid, timestamptz[\s\S]*\);/i,
    );
    expect(migrationSql).toContain("notify pgrst, 'reload schema';");
  });

  it("writes owner and lead names into the projects row", () => {
    expect(migrationSql).toMatch(
      /insert into public\.projects \([\s\S]*project_owner_name,[\s\S]*project_lead_name[\s\S]*\)/i,
    );
    expect(migrationSql).toMatch(
      /values \([\s\S]*p_project_owner_name,[\s\S]*p_project_lead_name[\s\S]*\)/i,
    );
  });
});
