"use client";

import { useActionState } from "react";
import {
  createVendorObligationAction,
  updateVendorObligationAction,
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
import type { VendorObligationRecordRow } from "@/lib/supabase/view-contracts";

type VendorObligationFormProps = {
  mode?: "create" | "edit";
  options: StudioFormOptions;
  defaultProjectId?: string;
  obligation?: VendorObligationRecordRow;
};

const initialState: FormActionState = {
  message: null,
  fieldErrors: {},
};

export function VendorObligationForm({
  mode = "create",
  options,
  defaultProjectId,
  obligation,
}: VendorObligationFormProps) {
  const [state, formAction] = useActionState(
    mode === "edit" ? updateVendorObligationAction : createVendorObligationAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {obligation ? (
        <>
          <input type="hidden" name="obligation_id" value={obligation.id} />
          <input type="hidden" name="original_project_id" value={obligation.project_id} />
        </>
      ) : null}
      <FormError message={state.message} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Project"
          htmlFor="vendor-project"
          required
          error={state.fieldErrors.project_id}
        >
          <select
            id="vendor-project"
            name="project_id"
            className={selectClass}
            defaultValue={obligation?.project_id ?? defaultProjectId ?? ""}
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
        <Field label="Title" htmlFor="obligation-title" required error={state.fieldErrors.title}>
          <input
            id="obligation-title"
            name="title"
            className={inputClass}
            defaultValue={obligation?.title ?? ""}
            placeholder="Consultant payment"
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 rounded-[20px] border border-border/80 bg-surface-muted/55 p-4 md:grid-cols-2">
        <input type="hidden" name="vendor_mode" value="existing" />
        <Field
          label="Existing vendor"
          htmlFor="vendor-id"
          required
          error={state.fieldErrors.vendor_id}
        >
          <select
            id="vendor-id"
            name="vendor_id"
            className={selectClass}
            defaultValue={obligation?.vendor_id ?? ""}
          >
            <option value="">Select vendor</option>
            {options.vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </Field>
        {mode === "create" ? (
          <>
            <Field
              label="Or new vendor"
              htmlFor="new-vendor-name"
              error={state.fieldErrors.new_vendor_name}
            >
              <input
                id="new-vendor-name"
                name="new_vendor_name"
                className={inputClass}
                placeholder="New vendor name"
                onChange={(event) => {
                  const form = event.currentTarget.form;
                  const modeInput = form?.elements.namedItem("vendor_mode");
                  if (modeInput instanceof HTMLInputElement) {
                    modeInput.value = event.currentTarget.value.trim()
                      ? "new"
                      : "existing";
                  }
                }}
              />
            </Field>
            <Field label="New vendor service" htmlFor="new-vendor-service">
              <input
                id="new-vendor-service"
                name="new_vendor_service_type"
                className={inputClass}
                placeholder="Engineering, rendering, survey"
              />
            </Field>
          </>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Amount" htmlFor="obligation-amount" required error={state.fieldErrors.amount}>
          <input
            id="obligation-amount"
            name="amount"
            type="number"
            min="0"
            step="1"
            className={inputClass}
            defaultValue={obligation?.amount ?? ""}
            required
          />
        </Field>
        <Field label="Status" htmlFor="obligation-status">
          <select
            id="obligation-status"
            name="status"
            className={selectClass}
            defaultValue={obligation?.status ?? "planned"}
          >
            <option value="planned">Planned</option>
            <option value="due">Due</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
        <Field label="Due date" htmlFor="obligation-due-date" error={state.fieldErrors.due_date}>
          <input
            id="obligation-due-date"
            name="due_date"
            type="date"
            className={inputClass}
            defaultValue={obligation?.due_date ?? ""}
          />
        </Field>
        <Field label="Paid date" htmlFor="obligation-paid-at" error={state.fieldErrors.paid_at}>
          <input
            id="obligation-paid-at"
            name="paid_at"
            type="date"
            className={inputClass}
            defaultValue={obligation?.paid_at ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Tax percentage"
          htmlFor="obligation-tax-percentage"
          error={state.fieldErrors.tax_percentage}
        >
          <input
            id="obligation-tax-percentage"
            name="tax_percentage"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            defaultValue={obligation?.tax_percentage ?? ""}
            placeholder="11"
          />
        </Field>
        <Field label="Tax status" htmlFor="obligation-tax-status">
          <select
            id="obligation-tax-status"
            name="tax_status"
            className={selectClass}
            defaultValue={obligation?.tax_status ?? "not_applicable"}
          >
            <option value="not_applicable">Not applicable</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </Field>
      </div>

      <Field label="Description" htmlFor="obligation-description">
        <textarea
          id="obligation-description"
          name="description"
          className={textareaClass}
          defaultValue={obligation?.description ?? ""}
          placeholder="Scope or payment context."
        />
      </Field>

      <Field label="Notes" htmlFor="obligation-notes">
        <textarea
          id="obligation-notes"
          name="notes"
          className={textareaClass}
          defaultValue={obligation?.notes ?? ""}
          placeholder="Payment or tax follow-up notes."
        />
      </Field>

      <div className="flex justify-end">
        <SubmitButton>
          {mode === "edit" ? "Save Vendor Obligation" : "Create Vendor Obligation"}
        </SubmitButton>
      </div>
    </form>
  );
}
