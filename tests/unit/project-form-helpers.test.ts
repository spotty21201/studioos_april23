import { describe, it, expect } from "vitest";
import {
  filterContactsForClient,
  isContactValidForClient,
  resolveContactIdOnModeChange,
  resolveNextContactIdOnClientChange,
} from "../../lib/project-form-helpers";
import type { ContactOption } from "../../lib/studio-form-data";

const mockContacts: ContactOption[] = [
  {
    id: "contact-1",
    client_id: "client-1",
    full_name: "Indri Contacts 1",
    email: "indri@client1.com",
    job_title: "Manager",
    is_primary: true,
  },
  {
    id: "contact-2",
    client_id: "client-2",
    full_name: "Doddy Contacts 2",
    email: "doddy@client2.com",
    job_title: "Director",
    is_primary: true,
  },
];

describe("Production ProjectForm State & Filtering Helpers (lib/project-form-helpers.ts)", () => {
  it("filters contacts strictly to the specified selected client and returns empty array when no client is selected", () => {
    const client1Contacts = filterContactsForClient(mockContacts, "client-1");
    expect(client1Contacts).toHaveLength(1);
    expect(client1Contacts[0].id).toBe("contact-1");

    const client2Contacts = filterContactsForClient(mockContacts, "client-2");
    expect(client2Contacts).toHaveLength(1);
    expect(client2Contacts[0].id).toBe("contact-2");

    const noClientContacts = filterContactsForClient(mockContacts, "");
    expect(noClientContacts).toEqual([]);
  });

  it("verifies if a contact belongs to a specified client and marks contact invalid when client is empty", () => {
    expect(isContactValidForClient(mockContacts, "client-1", "contact-1")).toBe(true);
    expect(isContactValidForClient(mockContacts, "client-2", "contact-1")).toBe(false);
    expect(isContactValidForClient(mockContacts, "client-2", "contact-2")).toBe(true);

    // Non-empty contact is invalid when no client is selected
    expect(isContactValidForClient(mockContacts, "", "contact-1")).toBe(false);
    // Empty contact is valid when no client is selected
    expect(isContactValidForClient(mockContacts, "", "")).toBe(true);
  });

  it("clears contact selection when client is cleared or changed to an incompatible client", () => {
    // Clearing client selection -> clears contact selection to ""
    const clearedOnNoClient = resolveNextContactIdOnClientChange(
      mockContacts,
      "",
      "contact-1",
    );
    expect(clearedOnNoClient).toBe("");

    // Changing from client-1 to client-2 while contact-1 is selected (incompatible) -> clears to ""
    const clearedContact = resolveNextContactIdOnClientChange(
      mockContacts,
      "client-2",
      "contact-1",
    );
    expect(clearedContact).toBe("");

    // Changing to client-1 while contact-1 is selected (compatible) -> preserves "contact-1"
    const preservedContact = resolveNextContactIdOnClientChange(
      mockContacts,
      "client-1",
      "contact-1",
    );
    expect(preservedContact).toBe("contact-1");
  });

  it("clears contact selection when switching client creation mode to new", () => {
    expect(resolveContactIdOnModeChange("new", "contact-1")).toBe("");
    expect(resolveContactIdOnModeChange("existing", "contact-1")).toBe("contact-1");
  });
});
