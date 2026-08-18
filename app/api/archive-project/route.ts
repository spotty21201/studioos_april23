import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    const { project_id, confirm_project_name } = await request.json();

    if (!project_id || !confirm_project_name) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    // In fallback preview mode, accept any name matching for demo
    const env = getSupabaseEnv();
    if (!env) {
      return NextResponse.json({ ok: true });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "Sign in is required to archive a project." },
        { status: 401 },
      );
    }

    // Fetch the project. The `is_archived` column may not exist in every
    // environment (it is added by a later migration), so tolerate that case.
    let project: { id: string; name: string; is_archived?: boolean } | null = null;
    let alreadyArchived = false;

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, is_archived")
      .eq("id", project_id)
      .maybeSingle();

    if (!error && data) {
      project = data as { id: string; name: string; is_archived?: boolean };
      alreadyArchived = project.is_archived === true;
    } else {
      // Column may be missing, or the live query may be denied (RLS / preview
      // environment with no session). Retry with just the base columns.
      const retry = await supabase
        .from("projects")
        .select("id, name")
        .eq("id", project_id)
        .maybeSingle();
      if (!retry.error && retry.data) {
        project = retry.data as { id: string; name: string; is_archived?: boolean };
      } else {
        return NextResponse.json(
          { ok: false, error: "Project not found or access denied." },
          { status: 404 },
        );
      }
    }

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found or access denied." },
        { status: 404 },
      );
    }

    if (alreadyArchived) {
      return NextResponse.json(
        { ok: false, error: "This project has already been archived." },
        { status: 409 },
      );
    }

    if (project.name.trim().toLowerCase() !== confirm_project_name.trim().toLowerCase()) {
      return NextResponse.json(
        { ok: false, error: "The project name does not match." },
        { status: 400 },
      );
    }

    const { error: updateErr } = await supabase
      .from("projects")
      .update({ is_archived: true, updated_by: user.id })
      .eq("id", project_id);

    if (updateErr) {
      return NextResponse.json(
        { ok: false, error: "Failed to archive project. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
