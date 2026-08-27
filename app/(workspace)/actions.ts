"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateInvoiceTotals } from "@/lib/finance/invoice-calculation";
import {
  requireEnumValue,
  validateCalendarDateString,
  validateCompletedDate,
  validateDateOrdering,
  validateEmailAddress,
  validateExternalUrl,
  validatePaidStatus,
} from "@/lib/validation/domain-validation";
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

function optionalId(formData: FormData, key: string) {
  const next = value(formData, key);
  return next.length > 0 ? next : null;
}

function optionalDate(formData: FormData, key: string, errors: FieldErrors) {
  const next = nullableValue(formData, key);
  if (next) {
    const error = validateCalendarDateString(next);
    if (error) {
      errors[key] = error;
    }
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

  const lifecycleStatus = requireEnumValue(
    value(formData, "lifecycle_status"),
    "lifecycle_status",
    "Lifecycle status",
    lifecycleStatuses,
    errors,
    { default: "proposal" },
  );

  const healthStatus = requireEnumValue(
    value(formData, "health_status"),
    "health_status",
    "Health status",
    healthStatuses,
    errors,
    { default: "on_track" },
  );

  const contractValue = numberValue(formData, "contract_value", "Contract value", errors, {
    required: true,
    min: 0,
  });
  const startDate = optionalDate(formData, "start_date", errors);
  const targetEndDate = optionalDate(formData, "target_end_date", errors);

  const dateOrderError = validateDateOrdering(startDate, targetEndDate);
  if (dateOrderError) {
    errors.target_end_date = dateOrderError;
  }

  if (clientMode === "existing" && !existingClientId) {
    errors.client_id = "Choose an existing client from the list.";
  }

  if (clientMode === "new" && !newClientName) {
    errors.new_client_name = "Enter a name for the new client.";
  }

  const newContactEmail = nullableValue(formData, "new_contact_email");
  if (newContactEmail) {
    const emailErr = validateEmailAddress(newContactEmail);
    if (emailErr) {
      errors.new_contact_email = emailErr;
    }
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

  if (contactId && clientMode === "existing") {
    const { data: contactRow } = await supabase
      .from("client_contacts")
      .select("id, client_id")
      .eq("id", contactId)
      .maybeSingle();

    if (!contactRow || contactRow.client_id !== clientId) {
      return fail("Review the highlighted project fields.", {
        primary_contact_id: "Selected primary contact does not belong to the chosen client.",
      });
    }
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
      p_lifecycle_status: lifecycleStatus ?? "proposal",
      p_health_status: healthStatus ?? "on_track",
      p_summary: nullableValue(formData, "summary"),
      p_location: nullableValue(formData, "location"),
      p_start_date: startDate,
      p_target_end_date: targetEndDate,
      p_completed_at: null,
      p_contract_value: contractValue ?? 0,
      p_currency: "IDR",
      p_project_owner_name: nullableValue(formData, "client_manager_name"),
      p_project_lead_name: nullableValue(formData, "project_lead_name"),
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
  const primaryContactId = optionalId(formData, "primary_contact_id");

  const lifecycleStatus = requireEnumValue(
    value(formData, "lifecycle_status"),
    "lifecycle_status",
    "Lifecycle status",
    lifecycleStatuses,
    errors,
    { default: "proposal" },
  );

  const healthStatus = requireEnumValue(
    value(formData, "health_status"),
    "health_status",
    "Health status",
    healthStatuses,
    errors,
    { default: "on_track" },
  );

  const contractValue = numberValue(formData, "contract_value", "Contract value", errors, {
    required: true,
    min: 0,
  });
  const startDate = optionalDate(formData, "start_date", errors);
  const targetEndDate = optionalDate(formData, "target_end_date", errors);
  const completedAt = optionalDate(formData, "completed_at", errors);

  const dateOrderError = validateDateOrdering(startDate, targetEndDate);
  if (dateOrderError) {
    errors.target_end_date = dateOrderError;
  }

  const completedError = validateCompletedDate(completedAt, lifecycleStatus);
  if (completedError) {
    errors.completed_at = completedError;
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted project fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  if (primaryContactId) {
    const { data: contactRow } = await supabase
      .from("client_contacts")
      .select("id, client_id")
      .eq("id", primaryContactId)
      .maybeSingle();

    if (!contactRow || contactRow.client_id !== clientId) {
      return fail("Review the highlighted project fields.", {
        primary_contact_id: "Selected primary contact does not belong to the chosen client.",
      });
    }
  }

  const patch: Record<string, string | number | null> = {
    project_code: projectCode,
    name,
    slug: slugify(`${projectCode} ${name}`),
    client_id: clientId,
    primary_contact_id: primaryContactId,
    lifecycle_status: lifecycleStatus ?? "proposal",
    health_status: healthStatus ?? "on_track",
    summary: nullableValue(formData, "summary"),
    location: nullableValue(formData, "location"),
    start_date: startDate,
    target_end_date: targetEndDate,
    completed_at: completedAt,
    contract_value: contractValue ?? 0,
    currency: "IDR",
    project_owner_name: nullableValue(formData, "client_manager_name"),
    project_lead_name: nullableValue(formData, "project_lead_name"),
  };

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

export async function archiveProjectAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const projectName = requireText(formData, "confirm_project_name", "Project name", errors);

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted fields below.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  // Verify the project exists and user-entered name matches
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, name, is_archived")
    .eq("id", projectId)
    .maybeSingle();

  if (fetchError || !project) {
    return fail("Project not found or access denied.", {});
  }

  if (project.is_archived) {
    return fail("This project has already been archived.", {});
  }

  if (project.name.toLowerCase() !== projectName.toLowerCase()) {
    errors.confirm_project_name = "The project name does not match.";
    return fail("Review the highlighted fields below.", errors);
  }

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true })
    .eq("id", projectId);

  if (error) {
    return fail(error.message, {});
  }

  revalidateWorkspace(projectId);
  redirect(`/projects`);
}

export async function restoreProjectAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted fields below.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, name, is_archived")
    .eq("id", projectId)
    .maybeSingle();

  if (fetchError || !project) {
    return fail("Project not found or access denied.", {});
  }

  if (!project.is_archived) {
    return fail("This project is not archived.", {});
  }

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: false })
    .eq("id", projectId);

  if (error) {
    return fail(error.message, {});
  }

  revalidateWorkspace(projectId);
  redirect(`/projects`);
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
  const rawPaidAt = optionalDate(formData, "paid_at", errors);

  const status = requireEnumValue(
    value(formData, "status"),
    "status",
    "Invoice status",
    invoiceStatuses,
    errors,
    { default: "draft" },
  );

  const taxStatus = requireEnumValue(
    value(formData, "tax_status"),
    "tax_status",
    "Tax status",
    taxStatuses,
    errors,
    { default: "not_applicable" },
  );

  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  const dateOrderError = validateDateOrdering(issuedDate, dueDate);
  if (dateOrderError) {
    errors.due_date = "Due date cannot precede issued date.";
  }

  const paidResult = validatePaidStatus(status, rawPaidAt, "invoice");
  if (paidResult.error) {
    errors.paid_at = paidResult.error;
  }

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

  const taxAmount = calculateInvoiceTotals(amount, taxPercentage).taxAmount;
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
      status: status ?? "draft",
      paid_at: paidResult.paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: taxStatus ?? "not_applicable",
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
  redirect(`/projects/${projectId}?tab=finance`);
}

export async function updateInvoiceAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const invoiceId = requireText(formData, "invoice_id", "Invoice", errors);
  const projectId = requireText(formData, "project_id", "Project", errors);
  const invoiceNumber = requireText(formData, "invoice_number", "Invoice number", errors);
  const title = requireText(formData, "title", "Title", errors);
  const amount = numberValue(formData, "invoice_amount", "Invoice amount", errors, {
    required: true,
    min: 0,
  });
  const issuedDate = optionalDate(formData, "issued_date", errors);
  const dueDate = optionalDate(formData, "due_date", errors);
  const rawPaidAt = optionalDate(formData, "paid_at", errors);

  const status = requireEnumValue(
    value(formData, "status"),
    "status",
    "Invoice status",
    invoiceStatuses,
    errors,
    { default: "draft" },
  );

  const taxStatus = requireEnumValue(
    value(formData, "tax_status"),
    "tax_status",
    "Tax status",
    taxStatuses,
    errors,
    { default: "not_applicable" },
  );

  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  const dateOrderError = validateDateOrdering(issuedDate, dueDate);
  if (dateOrderError) {
    errors.due_date = "Due date cannot precede issued date.";
  }

  const paidResult = validatePaidStatus(status, rawPaidAt, "invoice");
  if (paidResult.error) {
    errors.paid_at = paidResult.error;
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted invoice fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const { data: existingInvoice } = await supabase
    .from("invoices")
    .select("id, project_id")
    .eq("id", invoiceId)
    .maybeSingle();

  if (!existingInvoice) {
    return fail("Invoice not found or access denied.");
  }
  const originalProjectId = existingInvoice.project_id;

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const taxAmount = calculateInvoiceTotals(amount, taxPercentage).taxAmount;
  const { data: updatedRows, error } = await supabase
    .from("invoices")
    .update({
      project_id: projectId,
      client_id: projectResult.data.client_id,
      invoice_number: invoiceNumber,
      title,
      issued_date: issuedDate,
      due_date: dueDate,
      invoice_amount: amount ?? 0,
      status: status ?? "draft",
      paid_at: paidResult.paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: taxStatus ?? "not_applicable",
      notes: nullableValue(formData, "notes"),
      updated_by: auth.userId,
    })
    .eq("id", invoiceId)
    .select("id, project_id");

  if (error || !updatedRows || updatedRows.length === 0) {
    return fail(error?.message ?? "Unable to update invoice.");
  }

  revalidateWorkspace(originalProjectId);
  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}?tab=finance`);
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
  const rawPaidAt = optionalDate(formData, "paid_at", errors);

  const status = requireEnumValue(
    value(formData, "status"),
    "status",
    "Payment status",
    vendorObligationStatuses,
    errors,
    { default: "planned" },
  );

  const taxStatus = requireEnumValue(
    value(formData, "tax_status"),
    "tax_status",
    "Tax status",
    taxStatuses,
    errors,
    { default: "not_applicable" },
  );

  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  const paidResult = validatePaidStatus(status, rawPaidAt, "vendor obligation");
  if (paidResult.error) {
    errors.paid_at = paidResult.error;
  }

  if (vendorMode === "existing" && !existingVendorId) {
    errors.vendor_id = "Select a vendor from the list, or enter a new name below.";
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

  const taxAmount = calculateInvoiceTotals(amount, taxPercentage).taxAmount;
  const { data: obligation, error } = await supabase
    .from("vendor_obligations")
    .insert({
      project_id: projectId,
      vendor_id: vendorId,
      title,
      description: nullableValue(formData, "description"),
      due_date: dueDate,
      amount: amount ?? 0,
      status: status ?? "planned",
      paid_at: paidResult.paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: taxStatus ?? "not_applicable",
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
  const projectId = requireText(formData, "project_id", "Project", errors);
  const vendorId = requireText(formData, "vendor_id", "Vendor", errors);
  const title = requireText(formData, "title", "Title", errors);
  const amount = numberValue(formData, "amount", "Amount", errors, {
    required: true,
    min: 0,
  });
  const dueDate = optionalDate(formData, "due_date", errors);
  const rawPaidAt = optionalDate(formData, "paid_at", errors);

  const status = requireEnumValue(
    value(formData, "status"),
    "status",
    "Payment status",
    vendorObligationStatuses,
    errors,
    { default: "planned" },
  );

  const taxStatus = requireEnumValue(
    value(formData, "tax_status"),
    "tax_status",
    "Tax status",
    taxStatuses,
    errors,
    { default: "not_applicable" },
  );

  const taxPercentage = numberValue(formData, "tax_percentage", "Tax percentage", errors, {
    min: 0,
  });

  const paidResult = validatePaidStatus(status, rawPaidAt, "vendor obligation");
  if (paidResult.error) {
    errors.paid_at = paidResult.error;
  }

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted vendor obligation fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const { data: existingObligation } = await supabase
    .from("vendor_obligations")
    .select("id, project_id")
    .eq("id", obligationId)
    .maybeSingle();

  if (!existingObligation) {
    return fail("Vendor obligation not found or access denied.");
  }
  const originalProjectId = existingObligation.project_id;

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const taxAmount = calculateInvoiceTotals(amount, taxPercentage).taxAmount;
  const { data: updatedRows, error } = await supabase
    .from("vendor_obligations")
    .update({
      project_id: projectId,
      vendor_id: vendorId,
      title,
      description: nullableValue(formData, "description"),
      due_date: dueDate,
      amount: amount ?? 0,
      status: status ?? "planned",
      paid_at: paidResult.paidAt,
      tax_percentage: taxPercentage,
      tax_amount: taxAmount,
      tax_status: taxStatus ?? "not_applicable",
      notes: nullableValue(formData, "notes"),
      updated_by: auth.userId,
    })
    .eq("id", obligationId)
    .select("id, project_id");

  if (error || !updatedRows || updatedRows.length === 0) {
    return fail(error?.message ?? "Unable to update vendor obligation.");
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

  const sourceType = requireEnumValue(
    value(formData, "source_type"),
    "source_type",
    "Source type",
    documentSourceTypes,
    errors,
    { default: "external_link" },
  );

  const category = requireEnumValue(
    value(formData, "category"),
    "category",
    "Document category",
    documentCategories,
    errors,
    { default: "support_document" },
  );

  const filePath = nullableValue(formData, "file_path");
  const externalUrl = nullableValue(formData, "external_url");
  const documentDate = optionalDate(formData, "document_date", errors);

  if (sourceType === "file" && !filePath) {
    errors.file_path = "File path is required.";
  }

  if (sourceType === "external_link" && !externalUrl) {
    errors.external_url = "Web link is required.";
  }

  if (externalUrl) {
    const urlError = validateExternalUrl(externalUrl);
    if (urlError) {
      errors.external_url = urlError;
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
      category: category ?? "support_document",
      source_type: sourceType ?? "external_link",
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
  const projectId = requireText(formData, "project_id", "Project", errors);
  const title = requireText(formData, "title", "Title", errors);

  const sourceType = requireEnumValue(
    value(formData, "source_type"),
    "source_type",
    "Source type",
    documentSourceTypes,
    errors,
    { default: "external_link" },
  );

  const category = requireEnumValue(
    value(formData, "category"),
    "category",
    "Document category",
    documentCategories,
    errors,
    { default: "support_document" },
  );

  const filePath = nullableValue(formData, "file_path");
  const externalUrl = nullableValue(formData, "external_url");
  const documentDate = optionalDate(formData, "document_date", errors);

  if (sourceType === "file" && !filePath) {
    errors.file_path = "File path is required.";
  }

  if (sourceType === "external_link" && !externalUrl) {
    errors.external_url = "Web link is required.";
  }

  if (externalUrl) {
    const urlError = validateExternalUrl(externalUrl);
    if (urlError) {
      errors.external_url = urlError;
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

  const { data: existingDocument } = await supabase
    .from("documents")
    .select("id, project_id")
    .eq("id", documentId)
    .maybeSingle();

  if (!existingDocument) {
    return fail("Document not found or access denied.");
  }
  const originalProjectId = existingDocument.project_id;

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const { data: updatedRows, error } = await supabase
    .from("documents")
    .update({
      project_id: projectId,
      title,
      category: category ?? "support_document",
      source_type: sourceType ?? "external_link",
      file_path: sourceType === "file" ? filePath : null,
      external_url: sourceType === "external_link" ? externalUrl : null,
      linked_entity_type: "project",
      linked_entity_id: projectId,
      document_date: documentDate,
      description: nullableValue(formData, "description"),
      updated_by: auth.userId,
    })
    .eq("id", documentId)
    .select("id, project_id");

  if (error || !updatedRows || updatedRows.length === 0) {
    return fail(error?.message ?? "Unable to update document.");
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

  const noteType = requireEnumValue(
    value(formData, "note_type"),
    "note_type",
    "Note type",
    noteTypes,
    errors,
    { default: "meeting_note" },
  );

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
    p_note_type: noteType ?? "meeting_note",
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

  const noteType = requireEnumValue(
    value(formData, "note_type"),
    "note_type",
    "Note type",
    noteTypes,
    errors,
    { default: "meeting_note" },
  );

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted note fields.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const { data: existingNote } = await supabase
    .from("notes")
    .select("id, project_id")
    .eq("id", noteId)
    .maybeSingle();

  if (!existingNote) {
    return fail("Project note not found or access denied.");
  }

  const projectResult = await getProjectClientId(supabase, projectId);

  if (!projectResult.data) {
    return fail(projectResult.error ?? "Select a valid project.", {
      project_id: "Select a valid project.",
    });
  }

  const { data: updatedRows, error } = await supabase
    .from("notes")
    .update({
      title: nullableValue(formData, "title"),
      body,
      note_type: noteType ?? "meeting_note",
      linked_entity_type: "project",
      linked_entity_id: projectId,
      noted_at: notedAt ?? new Date().toISOString(),
      updated_by: auth.userId,
    })
    .eq("id", noteId)
    .eq("project_id", projectId)
    .select("id");

  if (error || !updatedRows || updatedRows.length === 0) {
    return fail(error?.message ?? "Unable to update project note.");
  }

  revalidateWorkspace(projectId);
  redirect(`/projects/${projectId}`);
}

export async function deleteProjectNoteAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errors: FieldErrors = {};
  const projectId = requireText(formData, "project_id", "Project", errors);
  const noteId = requireText(formData, "note_id", "Note", errors);
  const returnTab = (formData.get("return_tab") ?? "").toString();

  if (Object.keys(errors).length > 0) {
    return fail("Review the highlighted fields below.", errors);
  }

  const supabase = await createSupabaseServerClient();
  const auth = await requireAuthenticatedUser(supabase);

  if (!auth.userId) {
    return fail(auth.error ?? "Sign in is required.");
  }

  const { data: existingNote, error: fetchError } = await supabase
    .from("notes")
    .select("id, project_id")
    .eq("id", noteId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (fetchError || !existingNote) {
    return fail("Project note not found or access denied.");
  }

  const { data: deletedRows, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("project_id", projectId)
    .select("id");

  if (error || !deletedRows || deletedRows.length === 0) {
    return fail(error?.message ?? "Unable to delete project note.");
  }

  revalidateWorkspace(projectId);
  const tabSuffix = returnTab ? `?tab=${encodeURIComponent(returnTab)}` : "";
  redirect(`/projects/${projectId}${tabSuffix}`);
}
