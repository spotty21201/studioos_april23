import "server-only";

import { getSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStudioOsSource } from "@/lib/supabase/queries";
import type {
  ClientContactRow,
  ClientRow,
  DocumentRecordRow,
  InvoiceRecordRow,
  NoteRecordRow,
  ProfileRow,
  ProjectRecordRow,
  VendorObligationRecordRow,
  VendorRow,
} from "@/lib/supabase/view-contracts";

export type ContactOption = Pick<
  ClientContactRow,
  "id" | "client_id" | "full_name" | "email" | "job_title" | "is_primary"
>;

export type ClientOption = Pick<ClientRow, "id" | "name"> & {
  contacts: ContactOption[];
};

export type VendorOption = Pick<VendorRow, "id" | "name">;

export type ProfileOption = Pick<ProfileRow, "id" | "full_name" | "email" | "role">;

export type ProjectOption = {
  id: string;
  projectCode: string;
  name: string;
  clientId: string;
  clientName: string;
};

export type StudioFormOptions = {
  clients: ClientOption[];
  contacts: ContactOption[];
  vendors: VendorOption[];
  profiles: ProfileOption[];
  projects: ProjectOption[];
  warning: string | null;
};

export type ProjectEditFormData = {
  project: ProjectRecordRow;
  options: StudioFormOptions;
};

export type InvoiceEditFormData = {
  invoice: InvoiceRecordRow;
  options: StudioFormOptions;
};

export type VendorObligationEditFormData = {
  obligation: VendorObligationRecordRow;
  options: StudioFormOptions;
};

export type DocumentEditFormData = {
  document: DocumentRecordRow;
  options: StudioFormOptions;
};

export type NoteEditFormData = {
  note: NoteRecordRow;
  project: ProjectRecordRow;
};

function toWarning(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load form selector data.";
}

function mapProjects(projects: ProjectRecordRow[]): ProjectOption[] {
  return projects
    .map((project) => ({
      id: project.id,
      projectCode: project.project_code,
      name: project.name,
      clientId: project.client_id,
      clientName: project.client?.name ?? "Unknown client",
    }))
    .sort((left, right) => left.projectCode.localeCompare(right.projectCode));
}

export async function getStudioFormOptions(): Promise<StudioFormOptions> {
  const source = await getStudioOsSource();
  const baseProjects = mapProjects(source.data.projects);

  if (!getSupabaseEnv()) {
    return {
      clients: [],
      contacts: [],
      vendors: [],
      profiles: [],
      projects: baseProjects,
      warning:
        "Supabase is not configured in this environment, so write forms cannot load live selector records.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [clientsResult, contactsResult, vendorsResult, profilesResult] =
      await Promise.all([
        supabase
          .from("clients")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true }),
        supabase
          .from("client_contacts")
          .select("id, client_id, full_name, email, job_title, is_primary")
          .order("full_name", { ascending: true }),
        supabase
          .from("vendors")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true }),
        supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("is_active", true)
          .order("full_name", { ascending: true }),
      ]);

    const errors = [
      clientsResult.error,
      contactsResult.error,
      vendorsResult.error,
      profilesResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      throw new Error(errors.map((error) => error?.message).join(" | "));
    }

    const contacts = ((contactsResult.data ?? []) as ContactOption[]).sort(
      (left, right) => left.full_name.localeCompare(right.full_name),
    );
    const contactsByClient = new Map<string, ContactOption[]>();

    for (const contact of contacts) {
      const existing = contactsByClient.get(contact.client_id) ?? [];
      existing.push(contact);
      contactsByClient.set(contact.client_id, existing);
    }

    return {
      clients: ((clientsResult.data ?? []) as Pick<ClientRow, "id" | "name">[]).map(
        (client) => ({
          ...client,
          contacts: contactsByClient.get(client.id) ?? [],
        }),
      ),
      contacts,
      vendors: (vendorsResult.data ?? []) as VendorOption[],
      profiles: (profilesResult.data ?? []) as ProfileOption[],
      projects: baseProjects,
      warning: source.warning,
    };
  } catch (error) {
    return {
      clients: [],
      contacts: [],
      vendors: [],
      profiles: [],
      projects: baseProjects,
      warning: toWarning(error),
    };
  }
}

export async function getProjectEditFormData(
  projectId: string,
): Promise<ProjectEditFormData | null> {
  const [source, options] = await Promise.all([
    getStudioOsSource(),
    getStudioFormOptions(),
  ]);
  const project = source.data.projects.find(
    (item) => item.id === projectId || item.slug === projectId,
  );

  if (!project) {
    return null;
  }

  return { project, options };
}

export async function getInvoiceEditFormData(
  invoiceId: string,
): Promise<InvoiceEditFormData | null> {
  const [source, options] = await Promise.all([
    getStudioOsSource(),
    getStudioFormOptions(),
  ]);
  const invoice = source.data.invoices.find((item) => item.id === invoiceId);

  if (!invoice) {
    return null;
  }

  return { invoice, options };
}

export async function getVendorObligationEditFormData(
  obligationId: string,
): Promise<VendorObligationEditFormData | null> {
  const [source, options] = await Promise.all([
    getStudioOsSource(),
    getStudioFormOptions(),
  ]);
  const obligation = source.data.vendorObligations.find(
    (item) => item.id === obligationId,
  );

  if (!obligation) {
    return null;
  }

  return { obligation, options };
}

export async function getDocumentEditFormData(
  documentId: string,
): Promise<DocumentEditFormData | null> {
  const [source, options] = await Promise.all([
    getStudioOsSource(),
    getStudioFormOptions(),
  ]);
  const document = source.data.documents.find((item) => item.id === documentId);

  if (!document) {
    return null;
  }

  return { document, options };
}

export async function getNoteEditFormData(
  projectId: string,
  noteId: string,
): Promise<NoteEditFormData | null> {
  const source = await getStudioOsSource();
  const project = source.data.projects.find(
    (item) => item.id === projectId || item.slug === projectId,
  );

  if (!project) {
    return null;
  }

  const note = source.data.notes.find(
    (item) => item.id === noteId && item.project_id === project.id,
  );

  if (!note) {
    return null;
  }

  return { note, project };
}
