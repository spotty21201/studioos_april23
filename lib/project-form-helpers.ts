import type { ContactOption } from "@/lib/studio-form-data";

export type ClientSelectionMode = "existing" | "new";

/**
 * Filters contacts list to those belonging strictly to the specified client.
 * Returns an empty array if no client is selected.
 */
export function filterContactsForClient(
  contacts: ContactOption[],
  clientId: string,
): ContactOption[] {
  if (!clientId || clientId.trim().length === 0) {
    return [];
  }
  return contacts.filter((contact) => contact.client_id === clientId);
}

/**
 * Checks whether a given contact ID is valid for the specified client ID.
 * A non-empty contact ID is invalid when no client is selected.
 */
export function isContactValidForClient(
  contacts: ContactOption[],
  clientId: string,
  contactId: string,
): boolean {
  if (!contactId || contactId.trim().length === 0) {
    return true;
  }
  if (!clientId || clientId.trim().length === 0) {
    return false;
  }
  return contacts.some((c) => c.client_id === clientId && c.id === contactId);
}

/**
 * Determines the next selected contact ID when the client selection changes.
 * Returns empty string if the new client is empty or if current contact is incompatible.
 */
export function resolveNextContactIdOnClientChange(
  contacts: ContactOption[],
  newClientId: string,
  currentContactId: string,
): string {
  if (!newClientId || newClientId.trim().length === 0) {
    return "";
  }
  if (isContactValidForClient(contacts, newClientId, currentContactId)) {
    return currentContactId;
  }
  return "";
}

/**
 * Determines the contact ID when switching client creation mode.
 * When switching to "new" mode, contact selection is cleared to empty string.
 */
export function resolveContactIdOnModeChange(
  newMode: ClientSelectionMode,
  currentContactId: string,
): string {
  if (newMode === "new") {
    return "";
  }
  return currentContactId;
}
