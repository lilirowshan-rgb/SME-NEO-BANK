/** Rounds and formats a number with Persian digits and thousands separators. */
export function fa(n: number): string {
  return Math.round(n).toLocaleString('fa-IR');
}

/** Formats with a fixed number of decimals, e.g. faDec(3775.8) → "۳٬۷۷۵٫۸". */
export function faDec(n: number, digits = 1): string {
  return n.toLocaleString('fa-IR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** Formats a signed amount with an explicit +/− sign, e.g. "+۴۸٬۲۰۰٬۰۰۰". Render inside an LTR span. */
export function faSigned(n: number, digits = 0): string {
  const body = digits ? faDec(Math.abs(n), digits) : fa(Math.abs(n));
  return (n < 0 ? '−' : '+') + body;
}

/** Plain integer as Persian digits without separators (IDs, codes). */
export function faDigits(s: string | number): string {
  return String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

/** Converts Persian/Arabic-Indic digits to ASCII. */
export function toLatinDigits(s: string): string {
  return s.replace(/[۰-۹٠-٩]/g, (d) => String(d.charCodeAt(0) & 0xf));
}
