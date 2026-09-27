export type RepaymentMethod = 'auto' | 'manual';

// Sample figures from the design draft; the rate is still pending confirmation.
export const ANNUAL_RATE_PERCENT = 23;
export const ORIGINATION_FEE_RATE = 0.01;
export const MIN_AMOUNT_MILLION = 200;
export const MAX_AMOUNT_MILLION = 850;
export const AMOUNT_STEP_MILLION = 50;
export const TERM_OPTIONS = [2, 6, 12] as const;

export const REPAYMENT_METHODS: { id: RepaymentMethod; title: string; description: string }[] = [
  {
    id: 'auto',
    title: 'کسر خودکار از تسویه‌ها',
    description: 'قسط در روز سررسید از فروش شما برداشته می‌شود؛ نیازی به یادآوری نیست.',
  },
  {
    id: 'manual',
    title: 'پرداخت ماهانه دستی',
    description: 'خودتان تا روز سررسید از کیف پول یا کارت بانکی پرداخت می‌کنید.',
  },
];

export const INSTALLMENT_DATES = [
  '۱۰ آبان ۱۴۰۵',
  '۱۰ آذر ۱۴۰۵',
  '۱۰ دی ۱۴۰۵',
  '۱۰ بهمن ۱۴۰۵',
  '۱۰ اسفند ۱۴۰۵',
  '۱۰ فروردین ۱۴۰۶',
  '۱۰ اردیبهشت ۱۴۰۶',
  '۱۰ خرداد ۱۴۰۶',
  '۱۰ تیر ۱۴۰۶',
  '۱۰ مرداد ۱۴۰۶',
  '۱۰ شهریور ۱۴۰۶',
  '۱۰ مهر ۱۴۰۶',
];

export interface LoanQuote {
  principal: number;
  installment: number;
  fee: number;
  totalRepayment: number;
}

/** Amortized monthly installment for a principal in toman. */
export function quoteLoan(
  principal: number,
  termMonths: number,
  annualRatePercent = ANNUAL_RATE_PERCENT,
): LoanQuote {
  const r = annualRatePercent / 100 / 12;
  const installment = r === 0 ? principal / termMonths : (principal * r) / (1 - Math.pow(1 + r, -termMonths));
  return {
    principal,
    installment,
    fee: principal * ORIGINATION_FEE_RATE,
    totalRepayment: installment * termMonths,
  };
}
