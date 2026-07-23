import { describe, it, expect } from "vitest";
import {
  requireEnumValue,
  validateCalendarDateString,
  validateClientContactMatch,
  validateCompletedDate,
  validateDateOrdering,
  validateExternalUrl,
  validateNonNegativeNumber,
  validatePaidStatus,
} from "../../lib/validation/domain-validation";

describe("Production Domain Validation Logic (lib/validation/domain-validation.ts)", () => {
  describe("Calendar Date Parsing & Validation", () => {
    it("accepts valid YYYY-MM-DD calendar dates", () => {
      expect(validateCalendarDateString("2026-04-22")).toBeNull();
      expect(validateCalendarDateString("2024-02-29")).toBeNull(); // Leap year
    });

    it("rejects invalid calendar dates like Feb 31 or Month 13", () => {
      expect(validateCalendarDateString("2026-02-31")).toBe("Use a valid date.");
      expect(validateCalendarDateString("2026-04-31")).toBe("Use a valid date.");
      expect(validateCalendarDateString("2026-13-10")).toBe("Use a valid date.");
    });

    it("rejects malformed date strings", () => {
      expect(validateCalendarDateString("invalid-date")).toBe("Use a valid date.");
      expect(validateCalendarDateString("2026/04/22")).toBe("Use a valid date.");
    });
  });

  describe("Date Ordering", () => {
    it("accepts target_end_date on or after start_date", () => {
      expect(validateDateOrdering("2026-01-01", "2026-06-01")).toBeNull();
      expect(validateDateOrdering("2026-01-01", "2026-01-01")).toBeNull();
    });

    it("rejects target_end_date preceding start_date", () => {
      expect(validateDateOrdering("2026-06-01", "2026-01-01")).toBe(
        "Target end date cannot precede start date.",
      );
    });
  });

  describe("Completed Date Rule", () => {
    it("accepts completed_at when status is completed", () => {
      expect(validateCompletedDate("2026-05-01", "completed")).toBeNull();
    });

    it("rejects completed_at when status is not completed", () => {
      expect(validateCompletedDate("2026-05-01", "active")).toBe(
        "Completed date is only allowed for completed projects.",
      );
    });
  });

  describe("Paid Status and Date Consistency", () => {
    it("accepts paid status when paid_at is provided", () => {
      const res = validatePaidStatus("paid", "2026-04-01", "invoice");
      expect(res.error).toBeNull();
      expect(res.paidAt).toBe("2026-04-01");
    });

    it("rejects paid status when paid_at is missing", () => {
      const res = validatePaidStatus("paid", null, "invoice");
      expect(res.error).toBe("Paid invoices require a paid date.");
      expect(res.paidAt).toBeNull();
    });

    it("clears paid_at date when status is non-paid", () => {
      const res = validatePaidStatus("issued", "2026-04-01", "invoice");
      expect(res.error).toBeNull();
      expect(res.paidAt).toBeNull();
    });
  });

  describe("Document External URL Validation", () => {
    it("accepts valid http and https URLs", () => {
      expect(validateExternalUrl("https://example.com/doc.pdf")).toBeNull();
      expect(validateExternalUrl("http://example.com/doc.pdf")).toBeNull();
    });

    it("rejects disallowed protocols like ftp: or javascript:", () => {
      expect(validateExternalUrl("ftp://example.com/file")).toBe("URL must start with http:// or https://");
      expect(validateExternalUrl("javascript:alert(1)")).toBe("URL must start with http:// or https://");
    });

    it("rejects malformed URLs", () => {
      expect(validateExternalUrl("not a url")).toBe("Use a valid URL.");
    });
  });

  describe("Enum Checking with requireEnumValue", () => {
    const validStatuses = ["proposal", "active", "completed"] as const;

    it("returns typed enum when value is allowed", () => {
      const errors: Record<string, string> = {};
      const res = requireEnumValue("active", "lifecycle_status", "Lifecycle status", validStatuses, errors);
      expect(res).toBe("active");
      expect(errors).toEqual({});
    });

    it("sets field error and returns null when enum value is invalid", () => {
      const errors: Record<string, string> = {};
      const res = requireEnumValue("invalid_val", "lifecycle_status", "Lifecycle status", validStatuses, errors);
      expect(res).toBeNull();
      expect(errors.lifecycle_status).toBe("Lifecycle status is invalid.");
    });
  });

  describe("Client & Contact Consistency", () => {
    it("returns true when contact belongs to chosen client", () => {
      expect(validateClientContactMatch("client-1", "client-1")).toBe(true);
    });

    it("returns false when contact belongs to a different client", () => {
      expect(validateClientContactMatch("client-2", "client-1")).toBe(false);
    });
  });

  describe("Monetary Non-Negative Validation", () => {
    it("accepts 0 or positive amounts", () => {
      expect(validateNonNegativeNumber(0, "Contract value")).toBeNull();
      expect(validateNonNegativeNumber(1500, "Contract value")).toBeNull();
    });

    it("rejects negative amounts", () => {
      expect(validateNonNegativeNumber(-10, "Contract value")).toBe("Contract value must be 0 or more.");
    });
  });
});
