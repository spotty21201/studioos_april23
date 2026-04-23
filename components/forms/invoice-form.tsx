"use client";

import { useActionState } from "react";
import {
  createInvoiceAction,
  updateInvoiceAction,
  type FormActionState,
} from "@/app/(workspace)/actions";
import {
  Field,
  FormError,
  SubmitButton,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/forms/form-primitives";
import type { StudioFormOptions } from "@/lib/studio-form-data";
import type { InvoiceRecordRow } from "@/lib/supabase/view-contracts";

type InvoiceFormProps = {
  mode?: "create" | "edit";
  options: StudioFormOptions;
  defaultProjectId?: string;
  invoice?: InvoiceRecordRow;
};

const initialState: FormActionState = {
  message: null,
  fieldErrors: {},
};

export function InvoiceForm({
  mode = "create",
  options,
  defaultProjectId,
  invoice,
}: InvoiceFormProps) {
  const [state, formAction] = useActionState(
    mode === "edit" ? updateInvoiceAction : createInvoiceAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {invoice ? (
        <>
          <input type="hidden" name="invoice_id" value={invoice.id} />
          <input type="hidden" name="original_project_id" value={invoice.project_id} />
        </>
      ) : null}
      <FormError message={state.message} />

      <Field label="Project" htmlFor="invoice-project" required error={state.fieldErrors.project_id}>
        <select
          id="invoice-project"
          name="project_id"
          className={selectClass}
          defaultValue={invoice?.project_id ?? defaultProjectId ?? ""}
          required
        >
          <option value="">Select project</option>
          {options.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectCode} / {project.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Invoice number"
          htmlFor="invoice-number"
          required
          error={state.fieldErrors.invoice_number}
        >
          <input
            id="invoice-number"
            name="invoice_number"
            className={inputClass}
            defaultValue={invoice?.invoice_number ?? ""}
            placeholder="INV-26045"
            required
          />
        </Field>
        <Field label="Title" htmlFor="invoice-title" required error={state.fieldErrors.title}>
          <input
            id="invoice-title"
            name="title"
            className={inputClass}
            defaultValue={invoice?.title ?? ""}
            placeholder="Milestone billing"
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field
          label="Amount"
          htmlFor="invoice-amount"
          required
          error={state.fieldErrors.invoice_amount}
        >
          <input
            id="invoice-amount"
            name="invoice_amount"
            type="number"
            min="0"
            step="1"
            className={inputClass}
            defaultValue={invoice?.invoice_amount ?? ""}
            required
          />
        </Field>
        <Field label="Status" htmlFor="invoice-status">
          <select
            id="invoice-status"
            name="status"
            className={selectClass}
            defaultValue={invoice?.status ?? "draft"}
          >
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
        <Field label="Issued date" htmlFor="issued-date" error={state.fieldErrors.issued_date}>
          <input
            id="issued-date"
            name="issued_date"
            type="date"
            className={inputClass}
            defaultValue={invoice?.issued_date ?? ""}
          />
        </Field>
        <Field label="Due date" htmlFor="due-date" error={state.fieldErrors.due_date}>
          <input
            id="due-date"
            name="due_date"
            type="date"
            className={inputClass}
            defaultValue={invoice?.due_date ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Paid date" htmlFor="paid-at" error={state.fieldErrors.paid_at}>
          <input
            id="paid-at"
            name="paid_at"
            type="date"
            className={inputClass}
            defaultValue={invoice?.paid_at ?? ""}
          />
        </Field>
        <Field
          label="Tax percentage"
          htmlFor="invoice-tax-percentage"
          error={state.fieldErrors.tax_percentage}
        >
          <input
            id="invoice-tax-percentage"
            name="tax_percentage"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            defaultValue={invoice?.tax_percentage ?? ""}
            placeholder="11"
          />
        </Field>
        <Field label="Tax status" htmlFor="invoice-tax-status">
          <select
            id="invoice-tax-status"
            name="tax_status"
            className={selectClass}
            defaultValue={invoice?.tax_status ?? "not_applicable"}
          >
            <option value="not_applicable">Not applicable</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </Field>
      </div>

      <Field label="Notes" htmlFor="invoice-notes">
        <textarea
          id="invoice-notes"
          name="notes"
          className={textareaClass}
          defaultValue={invoice?.notes ?? ""}
          placeholder="Collection context or billing notes."
        />
      </Field>

      <div className="flex justify-end">
        <SubmitButton>{mode === "edit" ? "Save Invoice" : "Create Invoice"}</SubmitButton>
      </div>
    </form>
  );
}
