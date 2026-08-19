"use client";

import { useActionState, useState } from "react";
import {
  createProjectAction,
  updateProjectAction,
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
import type { ProjectRecordRow } from "@/lib/supabase/view-contracts";
import type { StudioFormOptions } from "@/lib/studio-form-data";
import {
  filterContactsForClient,
  resolveContactIdOnModeChange,
  resolveNextContactIdOnClientChange,
  type ClientSelectionMode,
} from "@/lib/project-form-helpers";

type ProjectFormProps = {
  mode: "create" | "edit";
  options: StudioFormOptions;
  project?: ProjectRecordRow;
};

const initialState: FormActionState = {
  message: null,
  fieldErrors: {},
};

export function ProjectForm({ mode, options, project }: ProjectFormProps) {
  const [state, formAction] = useActionState(
    mode === "create" ? createProjectAction : updateProjectAction,
    initialState,
  );

  const [clientMode, setClientMode] = useState<ClientSelectionMode>("existing");
  const [selectedClientId, setSelectedClientId] = useState(project?.client_id ?? "");
  const [selectedContactId, setSelectedContactId] = useState(project?.primary_contact_id ?? "");

  const contactOptions = filterContactsForClient(options.contacts, selectedClientId);

  function handleClientChange(newClientId: string) {
    setSelectedClientId(newClientId);
    setSelectedContactId(
      resolveNextContactIdOnClientChange(options.contacts, newClientId, selectedContactId),
    );
  }

  function handleClientModeChange(newMode: ClientSelectionMode) {
    setClientMode(newMode);
    setSelectedContactId(resolveContactIdOnModeChange(newMode, selectedContactId));
  }

  return (
    <form noValidate action={formAction} className="space-y-6">
      {project ? <input type="hidden" name="project_id" value={project.id} /> : null}
      <FormError message={state.message} fieldErrors={state.fieldErrors} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Project code"
          htmlFor="project-code"
          required
          error={state.fieldErrors.project_code}
        >
          <input
            id="project-code"
            name="project_code"
            className={inputClass}
            defaultValue={project?.project_code}
            placeholder="HDA-26018"
            required
            aria-invalid={Boolean(state.fieldErrors.project_code)}
            aria-describedby={state.fieldErrors.project_code ? "project-code-error" : undefined}
          />
        </Field>
        <Field
          label="Project name"
          htmlFor="name"
          required
          error={state.fieldErrors.name}
        >
          <input
            id="name"
            name="name"
            className={inputClass}
            defaultValue={project?.name}
            placeholder="Project name"
            required
            aria-invalid={Boolean(state.fieldErrors.name)}
            aria-describedby={state.fieldErrors.name ? "name-error" : undefined}
          />
        </Field>
      </div>

      {mode === "create" ? (
        <fieldset className="space-y-4 rounded-[4px] border border-border bg-surface-muted p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">
            About the Client
          </legend>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="radio"
                name="client_mode"
                value="existing"
                checked={clientMode === "existing"}
                onChange={() => handleClientModeChange("existing")}
                className="h-4 w-4 accent-accent"
              />
              Use existing client
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="radio"
                name="client_mode"
                value="new"
                checked={clientMode === "new"}
                onChange={() => handleClientModeChange("new")}
                className="h-4 w-4 accent-accent"
              />
              Create new client
            </label>
          </div>

          {clientMode === "existing" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Existing client"
                htmlFor="client-id"
                required
                error={state.fieldErrors.client_id}
              >
                <select
                  id="client-id"
                  name="client_id"
                  className={selectClass}
                  value={selectedClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  required
                  aria-invalid={Boolean(state.fieldErrors.client_id)}
                  aria-describedby={state.fieldErrors.client_id ? "client-id-error" : undefined}
                >
                  <option value="">Select client</option>
                  {options.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Primary contact"
                htmlFor="primary-contact-id"
                error={state.fieldErrors.primary_contact_id}
              >
                <select
                  id="primary-contact-id"
                  name="primary_contact_id"
                  className={selectClass}
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                  disabled={!selectedClientId}
                  aria-invalid={Boolean(state.fieldErrors.primary_contact_id)}
                  aria-describedby={
                    state.fieldErrors.primary_contact_id ? "primary-contact-id-error" : undefined
                  }
                >
                  <option value="">
                    {selectedClientId ? "Not set" : "Select a client first"}
                  </option>
                  {contactOptions.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.full_name}
                      {contact.email ? ` / ${contact.email}` : ""}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Client name"
                htmlFor="new-client-name"
                required
                error={state.fieldErrors.new_client_name}
              >
                <input
                  id="new-client-name"
                  name="new_client_name"
                  className={inputClass}
                  placeholder="Enter client name"
                  required
                  aria-invalid={Boolean(state.fieldErrors.new_client_name)}
                  aria-describedby={
                    state.fieldErrors.new_client_name ? "new-client-name-error" : undefined
                  }
                />
              </Field>
              <Field
                label="Contact name (optional)"
                htmlFor="new-contact-name"
                error={state.fieldErrors.new_contact_name}
              >
                <input
                  id="new-contact-name"
                  name="new_contact_name"
                  className={inputClass}
                  placeholder="Contact name (optional)"
                  aria-invalid={Boolean(state.fieldErrors.new_contact_name)}
                  aria-describedby={
                    state.fieldErrors.new_contact_name ? "new-contact-name-error" : undefined
                  }
                />
              </Field>
              <Field
                label="Contact email"
                htmlFor="new-contact-email"
                error={state.fieldErrors.new_contact_email}
              >
                <input
                  id="new-contact-email"
                  name="new_contact_email"
                  type="email"
                  className={inputClass}
                  placeholder="name@example.com"
                  aria-invalid={Boolean(state.fieldErrors.new_contact_email)}
                  aria-describedby={
                    state.fieldErrors.new_contact_email ? "new-contact-email-error" : undefined
                  }
                />
              </Field>
              <Field label="Contact role" htmlFor="new-contact-job-title">
                <input
                  id="new-contact-job-title"
                  name="new_contact_job_title"
                  className={inputClass}
                  placeholder="Program Lead"
                />
              </Field>
            </div>
          )}
        </fieldset>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Client"
            htmlFor="client-id"
            required
            error={state.fieldErrors.client_id}
          >
            <select
              id="client-id"
              name="client_id"
              className={selectClass}
              value={selectedClientId}
              onChange={(e) => handleClientChange(e.target.value)}
              required
              aria-invalid={Boolean(state.fieldErrors.client_id)}
              aria-describedby={state.fieldErrors.client_id ? "client-id-error" : undefined}
            >
              <option value="">Select client</option>
              {options.clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Primary contact"
            htmlFor="primary-contact-id"
            error={state.fieldErrors.primary_contact_id}
          >
            <select
              id="primary-contact-id"
              name="primary_contact_id"
              className={selectClass}
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              disabled={!selectedClientId}
              aria-invalid={Boolean(state.fieldErrors.primary_contact_id)}
              aria-describedby={
                state.fieldErrors.primary_contact_id ? "primary-contact-id-error" : undefined
              }
            >
              <option value="">
                {selectedClientId ? "Not set" : "Select a client first"}
              </option>
              {contactOptions.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.full_name}
                  {contact.email ? ` / ${contact.email}` : ""}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Stage" htmlFor="lifecycle-status">
          <select
            id="lifecycle-status"
            name="lifecycle_status"
            className={selectClass}
            defaultValue={project?.lifecycle_status ?? "proposal"}
          >
            <option value="proposal">Proposal</option>
            <option value="active">Active</option>
            <option value="on_hold">On hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
        <Field label="Project health" htmlFor="health-status">
          <select
            id="health-status"
            name="health_status"
            className={selectClass}
            defaultValue={project?.health_status ?? "on_track"}
          >
            <option value="on_track">On track</option>
            <option value="watch">Needs a closer look</option>
            <option value="at_risk">Action needed</option>
          </select>
        </Field>
        <Field
          label="Client manager (optional)"
          htmlFor="client-manager-name"
          error={state.fieldErrors.client_manager_name}
        >
          <input
            id="client-manager-name"
            name="client_manager_name"
            className={inputClass}
            defaultValue={project?.project_owner_name ?? ""}
            placeholder="e.g. Doddy Samiaji — person managing the client relationship"
            aria-invalid={Boolean(state.fieldErrors.client_manager_name)}
            aria-describedby={
              state.fieldErrors.client_manager_name ? "client-manager-name-error" : undefined
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Project Lead"
          htmlFor="project-lead-name"
          error={state.fieldErrors.project_lead_name}
        >
          <input
            id="project-lead-name"
            name="project_lead_name"
            className={inputClass}
            defaultValue={project?.project_lead_name ?? ""}
            placeholder="e.g. Maya Puspa"
            aria-invalid={Boolean(state.fieldErrors.project_lead_name)}
            aria-describedby={
              state.fieldErrors.project_lead_name ? "project-lead-name-error" : undefined
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Contract value"
          htmlFor="contract-value"
          required
          error={state.fieldErrors.contract_value}
        >
          <input
            id="contract-value"
            name="contract_value"
            type="number"
            min="0"
            step="1"
            className={inputClass}
            defaultValue={project?.contract_value ?? 0}
            required
            aria-invalid={Boolean(state.fieldErrors.contract_value)}
            aria-describedby={state.fieldErrors.contract_value ? "contract-value-error" : undefined}
          />
        </Field>
        <Field label="Start date" htmlFor="start-date" error={state.fieldErrors.start_date}>
          <input
            id="start-date"
            name="start_date"
            type="date"
            className={inputClass}
            defaultValue={project?.start_date ?? ""}
            aria-invalid={Boolean(state.fieldErrors.start_date)}
            aria-describedby={state.fieldErrors.start_date ? "start-date-error" : undefined}
          />
        </Field>
        <Field
          label="End date"
          htmlFor="target-end-date"
          error={state.fieldErrors.target_end_date}
        >
          <input
            id="target-end-date"
            name="target_end_date"
            type="date"
            className={inputClass}
            defaultValue={project?.target_end_date ?? ""}
            placeholder="2026-12-01"
            aria-invalid={Boolean(state.fieldErrors.target_end_date)}
            aria-describedby={
              state.fieldErrors.target_end_date ? "target-end-date-error" : undefined
            }
          />
        </Field>
      </div>

      {mode === "edit" ? (
        <div className="grid gap-4 md:grid-cols-1">
          <Field
            label="Completed date"
            htmlFor="completed-at"
            error={state.fieldErrors.completed_at}
          >
            <input
              id="completed-at"
              name="completed_at"
              type="date"
              className={inputClass}
              defaultValue={project?.completed_at ?? ""}
              aria-invalid={Boolean(state.fieldErrors.completed_at)}
              aria-describedby={
                state.fieldErrors.completed_at ? "completed-at-error" : undefined
              }
            />
          </Field>
        </div>
      ) : null}

      <Field label="Location" htmlFor="location">
        <input
          id="location"
          name="location"
          className={inputClass}
          defaultValue={project?.location ?? ""}
          placeholder="e.g. Bandung, Indonesia"
        />
      </Field>

      <Field label="Summary" htmlFor="summary">
        <textarea
          id="summary"
          name="summary"
          className={textareaClass}
          defaultValue={project?.summary ?? ""}
          placeholder="What is this project about and what are the key goals?"
        />
      </Field>

      <div className="flex justify-end">
        <SubmitButton>{mode === "create" ? "Create Project" : "Save Project"}</SubmitButton>
      </div>
    </form>
  );
}
