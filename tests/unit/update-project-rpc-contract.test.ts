import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationSql = readFileSync(
  new URL(
    "../../supabase/migrations/20260818000002_fix_update_project_rpc.sql",
    import.meta.url,
  ),
  "utf8",
);

const updateActionSource = readFileSync(
  new URL("../../app/(workspace)/actions.ts", import.meta.url),
  "utf8",
);

describe("update_project_with_activity RPC contract", () => {
  it("updates the owner-name fields sent by the project Server Action", () => {
    for (const field of ["project_owner_name", "project_lead_name"]) {
      expect(updateActionSource).toContain(`${field}:`);
      expect(migrationSql).toMatch(new RegExp(`${field}\\s*=\\s*case`, "i"));
      expect(migrationSql).toContain(`p_patch ? '${field}'`);
    }
  });

  it("does not reference columns removed by the owner refactor", () => {
    const functionBody = migrationSql.match(/as \$\$([\s\S]*?)\$\$;/i)?.[1] ?? "";

    expect(functionBody).not.toContain("project_owner_id");
    expect(functionBody).not.toContain("last_reviewed_at");
  });

  it("preserves authorization, grants, and schema-cache reload behavior", () => {
    expect(migrationSql).toContain("public.current_user_is_active()");
    expect(migrationSql).toContain(
      "grant execute on function public.update_project_with_activity(uuid, jsonb) to authenticated;",
    );
    expect(migrationSql).toContain("notify pgrst, 'reload schema';");
  });
});
