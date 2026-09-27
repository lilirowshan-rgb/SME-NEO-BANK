/** Rounds and formats a number with Persian digits and thousands separators. */
export function fa(n: number): string {
  return Math.round(n).toLocaleString('fa-IR');
}
