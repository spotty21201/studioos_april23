"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DocumentCategory,
  DocumentSourceType,
  InvoiceStatus,
  NoteType,
  ProjectHealthStatus,
  ProjectLifecycleStatus,
  TaxStatus,
  VendorObligationStatus,
} from "@/lib/supabase/view-contracts";

export type FieldErrors = Record<string, string>;

export type FormActionState = {
  message: string | null;
  fieldErrors: FieldErrors;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

const lifecycleStatuses = [
  "proposal",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const satisfies readonly ProjectLifecycleStatus[];

const healthStatuses = [
  "on_track",
  "watch",
  "at_risk",
] as const satisfies readonly ProjectHealthStatus[];

const invoiceStatuses = [
  "draft",
  "issued",
  "paid",
  "overdue",
  "cancelled",
] as const satisfies readonly InvoiceStatus[];

const vendorObligationStatuses = [
  "planned",
  "due",
  "paid",
  "overdue",
  "cancelled",
] as const satisfies readonly VendorObligationStatus[];

const taxStatuses = [
  "not_applicable",
  "unpaid",
  "paid",
] as const satisfies readonly TaxStatus[];

const documentCategories = [
  "proposal",
  "contract",
  "client_document",
  "deliverable",
  "support_document",
  "invoice_attachment",
  "vendor_attachment",
] as const satisfies readonly DocumentCategory[];

const documentSourceTypes = [
  "file",
  "external_link",
] as const satisfies readonly DocumentSourceType[];

const noteTypes = [
  "meeting_note",
  "agreement",
  "issue",
  "reminder",
  "follow_up",
  "decision",
] as const satisfies readonly NoteType[];

function fail(message: string, fieldErrors: FieldErrors = {}): FormActionState {
  return { message, fieldErrors };
}

function value(formData: FormData, key: string) {
  const raw = formData.get(key);

  if (typeof raw !== "string") {
    return "";
  }

  return raw.trim();
}

function nullableValue(formData: FormData, key: string) {
  const next = value(formData, key);
  return next.length > 0 ? next : null;
}

function requireText(formData: FormData, key: string, label: string, errors: FieldErrors) {
  const next = value(formData, key);

  if (next.length === 0) {
    errors[key] = `${label} is required.`;
  }

  return next;
}

function enumValue<T extends string>(
  formData: FormData,
  key: string,
  allowed: readonly T[],
  fallback: T,
) {
  const next = value(formData, key);
  return allowed.includes(next as T) ? (next as T) : fallback;
}

function optionalId(formData: FormData, key: string) {
  const next = value(formData, key);
  return next.length > 0 ? next : null;
}

function optionalDate(formData: FormData, key: string, errors: FieldErrors) {
  const next = nullableValue(formData, key);

  if (next && !/^\d{4}-\d{2}-\d{2}$/.test(next)) {
    errors[key] = "Use a valid date.";
  }

  return next;
}

function optionalDateTime(formData: FormData, key: string, errors: FieldErrors) {
  const next = nullableValue(formData, key);

  if (next && Number.isNaN(Date.parse(next))) {
    errors[key] = "Use a valid date and time.";
  }

  return next ? new Date(next).toISOString() : null;
}

function numberValue(
  formData: FormData,
  key: string,
  label: string,
  errors: FieldErrors,
  options: { required?: boolean; min?: number } = {},
) {
  const raw = value(formData, key).replaceAll(",", "");

  if (raw.length === 0) {
    if (options.required) {
      errors[key] = `${label} is required.`;
    }

    return null;
  }

  const next = Number(raw);

  if (!Number.isFinite(next)) {
    errors[key] = `${label} must be a number.`;
    return null;
  }

  if (typeof options.min === "number" && next < options.min) {
    errors[key] = `${label} must be ${options.min} or more.`;
  }

  return next;
}

function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : `project-${Date.now()}`;
}

async function requireAuthenticatedUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { userId: null, error: error?.message ?? "Sign in is required." };
  }

  return { userId: user.id, error: null };
}

function revalidateWorkspace(projectId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/finance");
  revalidatePath("/documents");
  revalidatePath("/activity");

  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
  }
}

async function getProjectClientId(
  supabase: SupabaseServerClient,
  projectId: string,
) {
  const { data, error } = await supabase
    .from("projects")
    .select("id, client_id, project_code, name")
    .eq("id", projectId)
    .maybeSingle();

  if (error || !data) {
    return {
      data: null,
      error: error?.message ?? "Select a valid project.",
    };
  }

  return {
    data: data as {
      id: string;
      client_id: string;
      project_code: string;
      name: string;
    },
    error: null,
  };
}

export async function createProjectAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectCode = requireText(formData, "project_code", "Project code", errors);
  const name = requireText(formData, "name", "Project name", errors);
  const clientMode = value(formData, "client_mode") === "new" ? "new" : "existing";
  const existingClientId = optionalId(formData, "client_id");
  const newClientName = nullableValue(formData, "new_client_name");
  const newContactName = nullableValue(formData, "new_contact_name");
  const primaryContactId = optionalId(formData, "primary_contact_id");
  const contractValue = numberValue(formData, "contract_value", "Contract value", errors, {
    required: true,
    min: 0,
  });
  const startDate = optionalDate(formData, "start_date", errors);
  const targetEndDate = optionalDate(formData, "target_end_date", errors);

  if (clientMode === "existing" && !existingClientId) {
    errors.client_id = "Select an existing client or add a new one.";
  }

  if (clientMode === "new" && !newClientName) {
    errors.new_client_name = "New client name is required.";
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted project fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  let clientId = existingClientId;
  let contactId = primaryContactId;

  if (clientMode === "new") {
    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        name: newClientName,
        created_by: auth.userId,
        updated_by: auth.userId,
      })
      .select("id")
      .single();

    if (error || !client) {
      return fail(error?.message ?? "Unable to create client.", {
        new_client_name: "Client could not be created.",
      });
    }

    clientId = (client as { id: string }).id;
    contactId = null;
  }

  if (!clientId) {
    return fail("Select a valid client.", { client_id: "Client is required." });
  }

  if (newContactName) {
    const { data: contact, error } = await supabase
      .from("client_contacts")
      .insert({
        client_id: clientId,
        full_name: newContactName,
        job_title: nullableValue(formData, "new_contact_job_title"),
        email: nullableValue(formData, "new_contact_email"),
        phone: nullableValue(formData, "new_contact_phone"),
        is_primary: true,
        created_by: auth.userId,
        updated_by: auth.userId,
      })
      .select("id")
      .single();

    if (error || !contact) {
      return fail(error?.message ?? "Unable to create client contact.", {
        new_contact_name: "Contact could not be created.",
      });
    }

    contactId = (contact as { id: string }).id;
  }

  const { data: project, error } = await supabase.rpc(
    "create_project_with_activity",
    {
      p_project_code: projectCode,
      p_name: name,
      p_slug: slugify(`${projectCode} ${name}`),
      p_client_id: clientId,
      p_primary_contact_id: contactId,
      p_lifecycle_status: enumValue(
        formData,
        "lifecycle_status",
        lifecycleStatuses,
        "proposal",
      ),
      p_health_status: enumValue(
        formData,
        "health_status",
        healthStatuses,
        "on_track",
      ),
      p_summary: nullableValue(formData, "summary"),
      p_location: nullableValue(formData, "location"),
      p_start_date: startDate,
      p_target_end_date: targetEndDate,
      p_completed_at: null,
      p_contract_value: contractValue ?? 0,
      p_currency: "IDR",
      p_project_owner_id: optionalId(formData, "project_owner_id"),
      p_last_reviewed_at: new Date().toISOString(),
    },
  );

  if (error || !project) {
    return fail(error?.message ?? "Unable to create project.");
  }

  const createdProject = project as { id: string; project_code: string };
  revalidateWorkspace(createdProject.id);
  redirect(`/projects/${createdProject.id}`);
}

export async function updateProjectAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const projectCode = requireText(formData, "project_code", "Project code", errors);
  const name = requireText(formData, "name", "Project name", errors);
  const clientId = requireText(formData, "client_id", "Client", errors);
  const contractValue = numberValue(formData, "contract_value", "Contract value", errors, {
    required: true,
    min: 0,
  });
  const startDate = optionalDate(formData, "start_date", errors);
  const targetEndDate = optionalDate(formData, "target_end_date", errors);
  const completedAt = optionalDate(formData, "completed_at", errors);

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted project fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const patch: Record<string, string | number | null> = {
    project_code: projectCode,
    name,
    slug: slugify(`${projectCode} ${name}`),
    client_id: clientId,
    primary_contact_id: optionalId(formData, "primary_contact_id"),
    lifecycle_status: enumValue(
      formData,
      "lifecycle_status",
      lifecycleStatuses,
      "proposal",
    ),
    health_status: enumValue(formData, "health_status", healthStatuses, "on_track"),
    summary: nullableValue(formData, "summary"),
    location: nullableValue(formData, "location"),
    start_date: startDate,
    target_end_date: targetEndDate,
    completed_at: completedAt,
    contract_value: contractValue ?? 0,
    currency: "IDR",
    project_owner_id: optionalId(formData, "project_owner_id"),
  };

  if (value(formData, "mark_reviewed") === "on") {
    patch.last_reviewed_at = new Date().toISOString();
  }

  const { error } = await supabase.rpc("update_project_with_activity", {
    p_project_id: projectId,
    p_patch: patch,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function createInvoiceAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const invoiceNumber = requireText(formData, "invoice_number", "Invoice number", errors);
  const title = requireText(formData, "title", "Title", errors);
  const amount = numberValue(formData, "invoice_amount", "Invoice amount", errors, {
    required: true,
    min: 0,
  });
  const issuedDate = optionalDate(formData, "issued_date", errors);
  const dueDate = optionalDate(formData, "due_date", errors);
  const paidAt = optionalDate(formData, "paid_at", errors);
  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted invoice fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const taxAmount = taxPercentage && amount ? (amount * taxPercentage) / 100 : 0;
  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      project_id: projectId,
      client_id: projectResult.data.client_id,
      invoice_number: invoiceNumber,
      title,
      issued_date: issuedDate,
      due_date: dueDate,
      invoice_amount: amount ?? 0,
      status: enumValue(formData, "status", invoiceStatuses, "draft"),
      paid_at: paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: enumValue(formData, "tax_status", taxStatuses, "not_applicable"),
      notes: nullableValue(formData, "notes"),
      created_by: auth.userId,
      updated_by: auth.userId,
    })
    .select("id, invoice_number")
    .single();

  if (error || !invoice) {
    return fail(error?.message ?? "Unable to create invoice.");
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function updateInvoiceAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const invoiceId = requireText(formData, "invoice_id", "Invoice", errors);
  const originalProjectId = requireText(
    formData,
    "original_project_id",
    "Original project",
    errors,
  );
  const projectId = requireText(formData, "project_id", "Project", errors);
  const invoiceNumber = requireText(formData, "invoice_number", "Invoice number", errors);
  const title = requireText(formData, "title", "Title", errors);
  const amount = numberValue(formData, "invoice_amount", "Invoice amount", errors, {
    required: true,
    min: 0,
  });
  const issuedDate = optionalDate(formData, "issued_date", errors);
  const dueDate = optionalDate(formData, "due_date", errors);
  const paidAt = optionalDate(formData, "paid_at", errors);
  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted invoice fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const taxAmount = taxPercentage && amount ? (amount * taxPercentage) / 100 : 0;
  const { error } = await supabase
    .from("invoices")
    .update({
      project_id: projectId,
      client_id: projectResult.data.client_id,
      invoice_number: invoiceNumber,
      title,
      issued_date: issuedDate,
      due_date: dueDate,
      invoice_amount: amount ?? 0,
      status: enumValue(formData, "status", invoiceStatuses, "draft"),
      paid_at: paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: enumValue(formData, "tax_status", taxStatuses, "not_applicable"),
      notes: nullableValue(formData, "notes"),
      updated_by: auth.userId,
    })
    .eq("id", invoiceId);

  if (error) {
    return fail(error.message);
  }

  revalidateWorkspace(originalProjectId);
  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function createVendorObligationAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const vendorMode = value(formData, "vendor_mode") === "new" ? "new" : "existing";
  const existingVendorId = optionalId(formData, "vendor_id");
  const newVendorName = nullableValue(formData, "new_vendor_name");
  const title = requireText(formData, "title", "Title", errors);
  const amount = numberValue(formData, "amount", "Amount", errors, {
    required: true,
    min: 0,
  });
  const dueDate = optionalDate(formData, "due_date", errors);
  const paidAt = optionalDate(formData, "paid_at", errors);
  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  if (vendorMode === "existing" && !existingVendorId) {
    errors.vendor_id = "Select an existing vendor or add a new one.";
  }

  if (vendorMode === "new" && !newVendorName) {
    errors.new_vendor_name = "New vendor name is required.";
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted vendor obligation fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  let vendorId = existingVendorId;

  if (vendorMode === "new") {
    const { data: vendor, error } = await supabase
      .from("vendors")
      .insert({
        name: newVendorName,
        service_type: nullableValue(formData, "new_vendor_service_type"),
        created_by: auth.userId,
        updated_by: auth.userId,
      })
      .select("id")
      .single();

    if (error || !vendor) {
      return fail(error?.message ?? "Unable to create vendor.", {
        new_vendor_name: "Vendor could not be created.",
      });
    }

    vendorId = (vendor as { id: string }).id;
  }

  if (!vendorId) {
    return fail("Select a valid vendor.", { vendor_id: "Vendor is required." });
  }

  const taxAmount = taxPercentage && amount ? (amount * taxPercentage) / 100 : 0;
  const { data: obligation, error } = await supabase
    .from("vendor_obligations")
    .insert({
      project_id: projectId,
      vendor_id: vendorId,
      title,
      description: nullableValue(formData, "description"),
      due_date: dueDate,
      amount: amount ?? 0,
      status: enumValue(formData, "status", vendorObligationStatuses, "planned"),
      paid_at: paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: enumValue(formData, "tax_status", taxStatuses, "not_applicable"),
      notes: nullableValue(formData, "notes"),
      created_by: auth.userId,
      updated_by: auth.userId,
    })
    .select("id, title")
    .single();

  if (error || !obligation) {
    return fail(error?.message ?? "Unable to create vendor obligation.");
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function updateVendorObligationAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const obligationId = requireText(formData, "obligation_id", "Vendor obligation", errors);
  const originalProjectId = requireText(
    formData,
    "original_project_id",
    "Original project",
    errors,
  );
  const projectId = requireText(formData, "project_id", "Project", errors);
  const vendorId = requireText(formData, "vendor_id", "Vendor", errors);
  const title = requireText(formData, "title", "Title", errors);
  const amount = numberValue(formData, "amount", "Amount", errors, {
    required: true,
    min: 0,
  });
  const dueDate = optionalDate(formData, "due_date", errors);
  const paidAt = optionalDate(formData, "paid_at", errors);
  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted vendor obligation fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const taxAmount = taxPercentage && amount ? (amount * taxPercentage) / 100 : 0;
  const { error } = await supabase
    .from("vendor_obligations")
    .update({
      project_id: projectId,
      vendor_id: vendorId,
      title,
      description: nullableValue(formData, "description"),
      due_date: dueDate,
      amount: amount ?? 0,
      status: enumValue(formData, "status", vendorObligationStatuses, "planned"),
      paid_at: paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: enumValue(formData, "tax_status", taxStatuses, "not_applicable"),
      notes: nullableValue(formData, "notes"),
      updated_by: auth.userId,
    })
    .eq("id", obligationId);

  if (error) {
    return fail(error.message);
  }

  revalidateWorkspace(originalProjectId);
  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function createDocumentAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const title = requireText(formData, "title", "Title", errors);
  const sourceType = enumValue(
    formData,
    "source_type",
    documentSourceTypes,
    "external_link",
  );
  const filePath = nullableValue(formData, "file_path");
  const externalUrl = nullableValue(formData, "external_url");
  const documentDate = optionalDate(formData, "document_date", errors);

  if (sourceType === "file" && !filePath) {
    errors.file_path = "Stored file reference is required.";
  }

  if (sourceType === "external_link" && !externalUrl) {
    errors.external_url = "External URL is required.";
  }

  if (externalUrl) {
    try {
      new URL(externalUrl);
    } catch {
      errors.external_url = "Use a valid URL.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted document fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const { data: document, error } = await supabase
    .from("documents")
    .insert({
      project_id: projectId,
      title,
      category: enumValue(formData, "category", documentCategories, "support_document"),
      source_type: sourceType,
      file_path: sourceType === "file" ? filePath : null,
      external_url: sourceType === "external_link" ? externalUrl : null,
      linked_entity_type: "project",
      linked_entity_id: projectId,
      document_date: documentDate,
      description: nullableValue(formData, "description"),
      created_by: auth.userId,
      updated_by: auth.userId,
    })
    .select("id, title")
    .single();

  if (error || !document) {
    return fail(error?.message ?? "Unable to create document reference.");
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function updateDocumentAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const documentId = requireText(formData, "document_id", "Document", errors);
  const originalProjectId = requireText(
    formData,
    "original_project_id",
    "Original project",
    errors,
  );
  const projectId = requireText(formData, "project_id", "Project", errors);
  const title = requireText(formData, "title", "Title", errors);
  const sourceType = enumValue(
    formData,
    "source_type",
    documentSourceTypes,
    "external_link",
  );
  const filePath = nullableValue(formData, "file_path");
  const externalUrl = nullableValue(formData, "external_url");
  const documentDate = optionalDate(formData, "document_date", errors);

  if (sourceType === "file" && !filePath) {
    errors.file_path = "Stored file reference is required.";
  }

  if (sourceType === "external_link" && !externalUrl) {
    errors.external_url = "External URL is required.";
  }

  if (externalUrl) {
    try {
      new URL(externalUrl);
    } catch {
      errors.external_url = "Use a valid URL.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted document fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const { error } = await supabase
    .from("documents")
    .update({
      project_id: projectId,
      title,
      category: enumValue(formData, "category", documentCategories, "support_document"),
      source_type: sourceType,
      file_path: sourceType === "file" ? filePath : null,
      external_url: sourceType === "external_link" ? externalUrl : null,
      linked_entity_type: "project",
      linked_entity_id: projectId,
      document_date: documentDate,
      description: nullableValue(formData, "description"),
      updated_by: auth.userId,
    })
    .eq("id", documentId);

  if (error) {
    return fail(error.message);
  }

  revalidateWorkspace(originalProjectId);
  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function createProjectNoteAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const body = requireText(formData, "body", "Note body", errors);
  const notedAt = optionalDateTime(formData, "noted_at", errors);

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted note fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const { data: note, error } = await supabase.rpc("create_note_with_activity", {
    p_project_id: projectId,
    p_body: body,
    p_note_type: enumValue(formData, "note_type", noteTypes, "meeting_note"),
    p_title: nullableValue(formData, "title"),
    p_linked_entity_type: "project",
    p_linked_entity_id: projectId,
    p_noted_at: notedAt ?? new Date().toISOString(),
  });

  if (error || !note) {
    return fail(error?.message ?? "Unable to create project note.");
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function updateProjectNoteAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const noteId = requireText(formData, "note_id", "Note", errors);
  const body = requireText(formData, "body", "Note body", errors);
  const notedAt = optionalDateTime(formData, "noted_at", errors);

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted note fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const { error } = await supabase
    .from("notes")
    .update({
      title: nullableValue(formData, "title"),
      body,
      note_type: enumValue(formData, "note_type", noteTypes, "meeting_note"),
      linked_entity_type: "project",
      linked_entity_id: projectId,
      noted_at: notedAt ?? new Date().toISOString(),
      updated_by: auth.userId,
    })
    .eq("id", noteId)
    .eq("project_id", projectId);

  if (error) {
    return fail(error.message);
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}
