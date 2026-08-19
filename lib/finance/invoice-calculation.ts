export type InvoiceCalculation = {
  baseAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalIncludingTax: number;
};

function nonNegativeNumber(value: number | string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function calculateInvoiceTotals(
  baseValue: number | string | null | undefined,
  taxPercentageValue: number | string | null | undefined,
): InvoiceCalculation {
  const baseAmount = nonNegativeNumber(baseValue);
  const taxPercentage = nonNegativeNumber(taxPercentageValue);
  const taxAmount = (baseAmount * taxPercentage) / 100;

  return {
    baseAmount,
    taxPercentage,
    taxAmount,
    totalIncludingTax: baseAmount + taxAmount,
  };
}
