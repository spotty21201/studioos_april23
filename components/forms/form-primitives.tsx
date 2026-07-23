"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export const inputClass =
  "h-11 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted aria-[invalid=true]:border-critical aria-[invalid=true]:bg-critical-soft/20";

export const selectClass =
  "h-11 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-border-strong focus:ring-2 focus:ring-border-muted aria-[invalid=true]:border-critical aria-[invalid=true]:bg-critical-soft/20";

export const textareaClass =
  "min-h-28 w-full rounded-[2px] border border-border bg-white px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted aria-[invalid=true]:border-critical aria-[invalid=true]:bg-critical-soft/20";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, required, error, children }: FieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary" htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-critical"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormError({
  message,
  fieldErrors = {},
}: {
  message: string | null;
  fieldErrors?: Record<string, string>;
}) {
  const errorEntries = Object.entries(fieldErrors);

  if (!message && errorEntries.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="space-y-2 rounded-[4px] border border-critical/40 bg-critical-soft p-4 text-sm text-critical"
    >
      <p className="font-semibold">{message ?? "Please review the highlighted fields below."}</p>
      {errorEntries.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs">
          {errorEntries.map(([fieldKey, errorMsg]) => {
            const elementId =
              fieldKey === "name"
                ? "name"
                : fieldKey === "project_code"
                  ? "project-code"
                  : fieldKey.replaceAll("_", "-");
            return (
              <li key={fieldKey}>
                <a href={`#${elementId}`} className="font-medium underline hover:no-underline">
                  {errorMsg}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] hover:bg-accent-strong disabled:cursor-not-allowed disabled:border-text-tertiary disabled:bg-text-tertiary"
    >
      {pending ? "Saving..." : children}
    </button>
  );
}
