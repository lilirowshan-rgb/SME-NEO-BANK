import { toLatinDigits } from './format';

/** Iranian national code (کد ملی): 10 digits with a mod-11 check digit. */
export function isValidNationalCode(input: string): boolean {
  const s = toLatinDigits(input).trim();
  if (!/^\d{10}$/.test(s) || /^(\d)\1{9}$/.test(s)) return false;
  const digits = [...s].map(Number);
  const sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);
  const r = sum % 11;
  return digits[9] === (r < 2 ? r : 11 - r);
}

/** Iranian mobile number: 09xxxxxxxxx (spaces allowed, +98 accepted). */
export function isValidMobile(input: string): boolean {
  const s = toLatinDigits(input).replace(/[\s-]/g, '').replace(/^\+98/, '0');
  return /^09\d{9}$/.test(s);
}

/** Jalali date in YYYY/MM/DD form with plausible ranges. */
export function isValidJalaliDate(input: string): boolean {
  const m = toLatinDigits(input).trim().match(/^(1[34]\d{2})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return false;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1) return false;
  return day <= (month <= 6 ? 31 : 30);
}
