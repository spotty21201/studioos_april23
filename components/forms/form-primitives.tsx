"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export const inputClass =
  "h-11 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted";

export const selectClass =
  "h-11 w-full rounded-[2px] border border-border bg-white px-4 text-sm text-text-primary outline-none focus:border-border-strong focus:ring-2 focus:ring-border-muted";

export const textareaClass =
  "min-h-28 w-full rounded-[2px] border border-border bg-white px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong focus:ring-2 focus:ring-border-muted";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, required, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary" htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-critical"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-critical">{error}</p> : null}
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[4px] border border-critical bg-critical-soft px-4 py-3 text-sm text-critical">
      {message}
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
