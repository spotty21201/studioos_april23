export type FieldErrors = Record<string, string>;

/**
 * Validates a YYYY-MM-DD date string for proper format and genuine calendar validity.
 * Rejects invalid dates such as 2026-02-31 or 2026-13-45.
 */
export function validateCalendarDateString(dateStr: string | null | undefined): string | null {
  if (!dateStr || dateStr.trim().length === 0) {
    return null;
  }

  const trimmed = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return "Use a valid date.";
  }

  const parts = trimmed.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (month < 1 || month > 12) {
    return "Use a valid date.";
  }

  if (day < 1 || day > 31) {
    return "Use a valid date.";
  }

  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return "Use a valid date.";
  }

  return null;
}

/**
 * Validates that target end date does not precede start date.
 */
export function validateDateOrdering(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): string | null {
  if (startDate && endDate && endDate < startDate) {
    return "Target end date cannot precede start date.";
  }
  return null;
}

/**
 * Validates that completed_at is only provided when lifecycle_status is 'completed'.
 */
export function validateCompletedDate(
  completedAt: string | null | undefined,
  lifecycleStatus: string | null | undefined,
): string | null {
  if (completedAt && completedAt.trim().length > 0 && lifecycleStatus !== "completed") {
    return "Completed date is only allowed for completed projects.";
  }
  return null;
}

/**
 * Validates paid status rules:
 * - Paid status requires a valid paid_at date.
 * - Non-paid status clears or rejects paid_at.
 */
export function validatePaidStatus(
  status: string | null | undefined,
  paidAt: string | null | undefined,
  label = "Item",
): { paidAt: string | null; error: string | null } {
  const isPaid = status === "paid";
  const hasPaidAt = Boolean(paidAt && paidAt.trim().length > 0);

  if (isPaid && !hasPaidAt) {
    return {
      paidAt: null,
      error: `Paid ${label.toLowerCase()}s require a paid date.`,
    };
  }

  if (!isPaid) {
    return {
      paidAt: null,
      error: null,
    };
  }

  return {
    paidAt: paidAt ? paidAt.trim() : null,
    error: null,
  };
}

/**
 * Validates external document URLs: must be valid URLs starting with http:// or https://.
 */
export function validateExternalUrl(url: string | null | undefined): string | null {
  if (!url || url.trim().length === 0) {
    return null;
  }

  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "URL must start with http:// or https://";
    }
    return null;
  } catch {
    return "Use a valid URL.";
  }
}

/**
 * Validates client/contact matching.
 */
export function validateClientContactMatch(
  contactClientId: string | null | undefined,
  selectedClientId: string,
): boolean {
  if (!contactClientId) {
    return true;
  }
  return contactClientId === selectedClientId;
}

/**
 * Validates non-negative monetary and tax values.
 */
export function validateNonNegativeNumber(
  num: number | null | undefined,
  label: string,
): string | null {
  if (num === null || num === undefined) {
    return null;
  }
  if (num < 0) {
    return `${label} must be 0 or more.`;
  }
  return null;
}

/**
 * Validates enum values against an allowed set of options.
 * Rejects invalid enum values with field-level errors rather than silently replacing them.
 */
export function requireEnumValue<T extends string>(
  raw: string,
  key: string,
  label: string,
  allowed: readonly T[],
  errors: FieldErrors,
  options: { required?: boolean; default?: T } = {},
): T | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    if (options.required) {
      errors[key] = `${label} is required.`;
      return null;
    }
    return options.default ?? null;
  }

  if (!allowed.includes(trimmed as T)) {
    errors[key] = `${label} is invalid.`;
    return null;
  }

  return trimmed as T;
}
