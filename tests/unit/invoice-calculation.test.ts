import { describe, expect, it } from "vitest";
import { calculateInvoiceTotals } from "../../lib/finance/invoice-calculation";

describe("Mira and Bu Indri invoice reconciliation", () => {
  it("reconciles the supplied three-project values at 11% VAT", () => {
    const projects = [90_000_000, 250_700_000, 189_300_000].map((contract) =>
      calculateInvoiceTotals(contract, 11),
    );

    expect(projects.map((project) => project.taxAmount)).toEqual([
      9_900_000,
      27_577_000,
      20_823_000,
    ]);
    expect(projects.reduce((sum, project) => sum + project.baseAmount, 0)).toBe(
      530_000_000,
    );
    expect(projects.reduce((sum, project) => sum + project.taxAmount, 0)).toBe(
      58_300_000,
    );
    expect(
      projects.reduce((sum, project) => sum + project.totalIncludingTax, 0),
    ).toBe(588_300_000);
  });

  it("fails safely to zero for invalid or negative values", () => {
    expect(calculateInvoiceTotals("not-a-number", 11).totalIncludingTax).toBe(0);
    expect(calculateInvoiceTotals(-100, -11)).toEqual({
      baseAmount: 0,
      taxPercentage: 0,
      taxAmount: 0,
      totalIncludingTax: 0,
    });
  });
});
