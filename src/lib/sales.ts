// How much of a merchant's total sales DigiPay can see, and how that drives the credit limit.
// Amounts are million toman per month (sample data). Weights say how much each toman counts toward credit.

export type SourceId = 'digikala' | 'gateway' | 'pos' | 'transfers' | 'cash';
export type Confidence = 'verified' | 'connected' | 'declared' | 'unknown';

export interface SalesSource {
  id: SourceId;
  name: string;
  how: string;
  monthly: number;
}

export const SOURCES: SalesSource[] = [
  { id: 'digikala', name: 'فروش در دیجی‌کالا', how: 'خودکار از بازارگاه دیجی‌کالا', monthly: 760 },
  { id: 'gateway', name: 'درگاه و لینک پرداخت دیجی‌پی', how: 'خودکار از تراکنش‌های دیجی‌پی', monthly: 480 },
  { id: 'pos', name: 'کارتخوان‌های سایر شرکت‌ها', how: 'از گردش حساب بانکی که تسویه در آن می‌نشیند', monthly: 910 },
  { id: 'transfers', name: 'فروش عمده و کارت‌به‌کارت', how: 'از واریزهای ورودی گردش حساب بانکی', monthly: 420 },
  { id: 'cash', name: 'فروش نقدی', how: 'ثبت روزانه در اپ؛ با واریز به بانک تأیید می‌شود', monthly: 350 },
];

export interface Connections {
  bank: boolean;
  moadian: boolean;
  cashLogged: boolean;
}

export const WEIGHT: Record<Confidence, number> = { verified: 1, connected: 0.8, declared: 0.25, unknown: 0 };

/** Confidence of one source given which connections the merchant has made. */
export function confidenceOf(id: SourceId, c: Connections): Confidence {
  if (id === 'digikala' || id === 'gateway') return 'verified';
  if (id === 'pos' || id === 'transfers') return c.bank ? 'connected' : 'unknown';
  return c.cashLogged ? 'declared' : 'unknown';
}

/** Weight actually applied: e-invoices from Moadian corroborate bank and cash figures. */
export function weightOf(id: SourceId, c: Connections): number {
  const conf = confidenceOf(id, c);
  if (!c.moadian || conf === 'verified' || conf === 'unknown') return WEIGHT[conf];
  return conf === 'connected' ? 0.95 : 0.5;
}

export const LIMIT_MULTIPLE = 0.7; // credit limit ≈ 70% of one month of weighted sales
export const LIMIT_CAP = 2000; // million toman (loan product maximum)

export function summarize(c: Connections) {
  let known = 0;
  let verified = 0;
  let weighted = 0;
  for (const s of SOURCES) {
    const conf = confidenceOf(s.id, c);
    if (conf === 'unknown') continue;
    known += s.monthly;
    if (conf === 'verified') verified += s.monthly;
    weighted += s.monthly * weightOf(s.id, c);
  }
  const limit = Math.min(LIMIT_CAP, Math.floor((weighted * LIMIT_MULTIPLE) / 50) * 50);
  return { known, verified, weighted, limit, coverage: known ? verified / known : 1 };
}
