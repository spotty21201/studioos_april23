import { describe, it, expect } from "vitest";
import { createProjectAction } from "../../app/(workspace)/actions";
import { validateEmailAddress } from "../../lib/validation/domain-validation";

describe("Project Form Server Action Validation & Mode Handling", () => {
  it("rejects project creation when required project_code and name are missing", async () => {
    const formData = new FormData();
    formData.set("client_mode", "existing");
    formData.set("client_id", "30000000-0000-4000-8000-000000000001");

    const result = await createProjectAction({ message: null, fieldErrors: {} }, formData);

    expect(result.message).toContain("Review the highlighted project fields");
    expect(result.fieldErrors.project_code).toBe("Project code is required.");
    expect(result.fieldErrors.name).toBe("Project name is required.");
  });

  it("rejects existing-client mode when client_id is missing", async () => {
    const formData = new FormData();
    formData.set("project_code", "HDA-999");
    formData.set("name", "Test Project");
    formData.set("client_mode", "existing");
    formData.set("client_id", "");
    formData.set("contract_value", "100000000");

    const result = await createProjectAction({ message: null, fieldErrors: {} }, formData);

    expect(result.fieldErrors.client_id).toBe("Choose an existing client from the list.");
  });

  it("rejects new-client mode when new_client_name is missing", async () => {
    const formData = new FormData();
    formData.set("project_code", "HDA-999");
    formData.set("name", "Test Project");
    formData.set("client_mode", "new");
    formData.set("new_client_name", "");
    formData.set("contract_value", "100000000");

    const result = await createProjectAction({ message: null, fieldErrors: {} }, formData);

    expect(result.fieldErrors.new_client_name).toBe("Enter a name for the new client.");
  });

  it("rejects invalid contact email format for new contact", async () => {
    const formData = new FormData();
    formData.set("project_code", "HDA-999");
    formData.set("name", "Test Project");
    formData.set("client_mode", "new");
    formData.set("new_client_name", "PT New Client");
    formData.set("new_contact_name", "Jane Doe");
    formData.set("new_contact_email", "not-a-valid-email");
    formData.set("contract_value", "100000000");

    const result = await createProjectAction({ message: null, fieldErrors: {} }, formData);

    expect(result.fieldErrors.new_contact_email).toBe("Use a valid email address.");
  });

  it("accepts valid contact email address format", () => {
    expect(validateEmailAddress("indri@hda.design")).toBeNull();
    expect(validateEmailAddress("doddy@hda.design")).toBeNull();
    expect(validateEmailAddress("invalid-email")).toBe("Use a valid email address.");
    expect(validateEmailAddress("")).toBeNull();
  });

  it("rejects negative contract_value", async () => {
    const formData = new FormData();
    formData.set("project_code", "HDA-999");
    formData.set("name", "Test Project");
    formData.set("client_mode", "existing");
    formData.set("client_id", "30000000-0000-4000-8000-000000000001");
    formData.set("contract_value", "-500");

    const result = await createProjectAction({ message: null, fieldErrors: {} }, formData);

    expect(result.fieldErrors.contract_value).toBe("Contract value must be 0 or more.");
  });

  it("rejects invalid date ordering where target_end_date precedes start_date", async () => {
    const formData = new FormData();
    formData.set("project_code", "HDA-999");
    formData.set("name", "Test Project");
    formData.set("client_mode", "existing");
    formData.set("client_id", "30000000-0000-4000-8000-000000000001");
    formData.set("contract_value", "100000000");
    formData.set("start_date", "2026-10-01");
    formData.set("target_end_date", "2026-01-01");

    const result = await createProjectAction({ message: null, fieldErrors: {} }, formData);

    expect(result.fieldErrors.target_end_date).toBe("Target end date cannot precede start date.");
  });
});
