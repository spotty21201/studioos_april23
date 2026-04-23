"use client";

import { useActionState } from "react";
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
  const contactOptions =
    mode === "edit" && project
      ? options.contacts.filter((contact) => contact.client_id === project.client_id)
      : options.contacts;

  return (
    <form action={formAction} className="space-y-6">
      {project ? <input type="hidden" name="project_id" value={project.id} /> : null}
      <FormError message={state.message} />

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
            placeholder="AIM-26018"
            required
          />
        </Field>
        <Field
          label="Project name"
          htmlFor="project-name"
          required
          error={state.fieldErrors.name}
        >
          <input
            id="project-name"
            name="name"
            className={inputClass}
            defaultValue={project?.name}
            placeholder="Project name"
            required
          />
        </Field>
      </div>

      {mode === "create" ? (
        <div className="grid gap-4 rounded-[20px] border border-border/80 bg-surface-muted/55 p-4 md:grid-cols-2">
          <input type="hidden" name="client_mode" value="existing" />
          <Field
            label="Existing client"
            htmlFor="client-id"
            required
            error={state.fieldErrors.client_id}
          >
            <select id="client-id" name="client_id" className={selectClass}>
              <option value="">Select client</option>
              {options.clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Or new client"
            htmlFor="new-client-name"
            error={state.fieldErrors.new_client_name}
          >
            <input
              id="new-client-name"
              name="new_client_name"
              className={inputClass}
              placeholder="New client name"
              onChange={(event) => {
                const form = event.currentTarget.form;
                const modeInput = form?.elements.namedItem("client_mode");
                if (modeInput instanceof HTMLInputElement) {
                  modeInput.value = event.currentTarget.value.trim() ? "new" : "existing";
                }
              }}
            />
          </Field>
          <Field
            label="Existing primary contact"
            htmlFor="primary-contact-id"
            error={state.fieldErrors.primary_contact_id}
          >
            <select id="primary-contact-id" name="primary_contact_id" className={selectClass}>
              <option value="">Not set</option>
              {contactOptions.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.full_name}
                  {contact.email ? ` / ${contact.email}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="New primary contact"
            htmlFor="new-contact-name"
            error={state.fieldErrors.new_contact_name}
          >
            <input
              id="new-contact-name"
              name="new_contact_name"
              className={inputClass}
              placeholder="Contact name"
            />
          </Field>
          <Field label="Contact email" htmlFor="new-contact-email">
            <input
              id="new-contact-email"
              name="new_contact_email"
              type="email"
              className={inputClass}
              placeholder="name@example.com"
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
              defaultValue={project?.client_id}
              required
            >
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
              defaultValue={project?.primary_contact_id ?? ""}
            >
              <option value="">Not set</option>
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
        <Field label="Lifecycle" htmlFor="lifecycle-status">
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
        <Field label="Health" htmlFor="health-status">
          <select
            id="health-status"
            name="health_status"
            className={selectClass}
            defaultValue={project?.health_status ?? "on_track"}
          >
            <option value="on_track">On track</option>
            <option value="watch">Watch</option>
            <option value="at_risk">At risk</option>
          </select>
        </Field>
        <Field label="Project owner" htmlFor="project-owner-id">
          <select
            id="project-owner-id"
            name="project_owner_id"
            className={selectClass}
            defaultValue={project?.project_owner_id ?? ""}
          >
            <option value="">Not assigned</option>
            {options.profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name}
              </option>
            ))}
          </select>
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
          />
        </Field>
        <Field label="Start date" htmlFor="start-date" error={state.fieldErrors.start_date}>
          <input
            id="start-date"
            name="start_date"
            type="date"
            className={inputClass}
            defaultValue={project?.start_date ?? ""}
          />
        </Field>
        <Field
          label="Target end"
          htmlFor="target-end-date"
          error={state.fieldErrors.target_end_date}
        >
          <input
            id="target-end-date"
            name="target_end_date"
            type="date"
            className={inputClass}
            defaultValue={project?.target_end_date ?? ""}
          />
        </Field>
      </div>

      {mode === "edit" ? (
        <div className="grid gap-4 md:grid-cols-2">
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
            />
          </Field>
          <label className="flex h-11 items-center gap-3 rounded-2xl border border-border bg-white px-4 text-sm font-medium text-text-primary">
            <input name="mark_reviewed" type="checkbox" className="h-4 w-4 accent-accent" />
            Mark reviewed now
          </label>
        </div>
      ) : null}

      <Field label="Location" htmlFor="location">
        <input
          id="location"
          name="location"
          className={inputClass}
          defaultValue={project?.location ?? ""}
          placeholder="Bandung, Indonesia"
        />
      </Field>

      <Field label="Summary" htmlFor="summary">
        <textarea
          id="summary"
          name="summary"
          className={textareaClass}
          defaultValue={project?.summary ?? ""}
          placeholder="Current project context for leadership."
        />
      </Field>

      <div className="flex justify-end">
        <SubmitButton>{mode === "create" ? "Create Project" : "Save Project"}</SubmitButton>
      </div>
    </form>
  );
}
