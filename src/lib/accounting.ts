export type Period = 'month' | 'quarter' | 'year';

export const PERIODS: Record<Period, { label: string; caption: string; scale: number; prevGrowth: number }> = {
  month: { label: 'این ماه', caption: 'شهریور ۱۴۰۵', scale: 0.345, prevGrowth: 8 },
  quarter: { label: 'این فصل', caption: 'تابستان ۱۴۰۵', scale: 1, prevGrowth: 8 },
  year: { label: 'امسال', caption: 'فروردین تا شهریور ۱۴۰۵', scale: 1.93, prevGrowth: 31 },
};

// Summer 1405, million toman. Sample data from the design draft.
export const GROSS_SALES = 3844;
export const RETURNS = 68.2;

export const EXPENSES = [
  { key: 'cogs', label: 'بهای تمام‌شده کالا', pnlLabel: 'بهای تمام‌شده کالا', amount: 2182.4 },
  { key: 'fees', label: 'کارمزد فروش', pnlLabel: 'کارمزد دیجی‌کالا و دیجی‌پی', amount: 365.8 },
  { key: 'shipping', label: 'ارسال', pnlLabel: 'ارسال و بسته‌بندی', amount: 127.1 },
  { key: 'payroll', label: 'حقوق', pnlLabel: 'حقوق و دستمزد', amount: 341 },
  { key: 'rent', label: 'اجاره', pnlLabel: 'اجاره', amount: 108.5 },
  { key: 'ads', label: 'تبلیغات', pnlLabel: 'تبلیغات', amount: 148.8 },
  { key: 'finance', label: 'هزینه‌های مالی', pnlLabel: 'هزینه‌های مالی (تسویه زودهنگام، سود وام)', amount: 65.1 },
  { key: 'other', label: 'سایر', pnlLabel: 'سایر', amount: 43.4 },
] as const;

export function profitAndLoss(scale = 1) {
  const r = (n: number) => Math.round(n * scale * 10) / 10;
  const gross = r(GROSS_SALES);
  const returns = r(RETURNS);
  const net = Math.round((gross - returns) * 10) / 10;
  const expenses = EXPENSES.map((e) => ({ ...e, amount: r(e.amount) }));
  const totalExpenses = Math.round(expenses.reduce((s, e) => s + e.amount, 0) * 10) / 10;
  const profit = Math.round((net - totalExpenses) * 10) / 10;
  return { gross, returns, net, expenses, totalExpenses, profit, margin: (profit / net) * 100 };
}
