// Pay-to-supplier (buyer-led supply chain finance / reverse factoring).
// Digipay pays the supplier a discounted amount now; the merchant pays the full invoice on the due date.
// The discount is Digipay's revenue. Rates are samples to be replaced with the real tariff.

export const ANNUAL_DISCOUNT_RATE = 0.3;
export const TERM_OPTIONS = [30, 45, 60, 90] as const;

export interface SupplierQuote {
  invoice: number;
  days: number;
  /** What the supplier receives today. */
  supplierReceives: number;
  /** Discount kept by Digipay (its revenue before funding cost). */
  discount: number;
  /** What the merchant pays on the due date. */
  merchantPays: number;
  /** Discount as a share of the invoice. */
  discountPct: number;
}

export function quoteSupplierPayment(invoice: number, days: number, annualRate = ANNUAL_DISCOUNT_RATE): SupplierQuote {
  const discount = Math.round((invoice * annualRate * days) / 365);
  return {
    invoice,
    days,
    supplierReceives: invoice - discount,
    discount,
    merchantPays: invoice,
    discountPct: (discount / invoice) * 100,
  };
}
