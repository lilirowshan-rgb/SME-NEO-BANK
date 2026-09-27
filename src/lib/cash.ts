export const LOW_BALANCE = 60; // million toman

// 30-day balance forecast in million toman, starting today (5 Mehr 1405). Sample data.
export const FORECAST = [
  218, 222, 226, 219, 230, 202, 198, 204, 206, 190, 158, 162, 166, 158, 330, 326, 322, 318, 314, 310, 306, 300, 296, 292,
  288, 48, 42, 52, 58, 66,
];

/** Persian date label for a day offset from 5 Mehr (Mehr has 30 days). */
export function forecastDate(offset: number): string {
  const day = 5 + offset;
  return day <= 30 ? `${day.toLocaleString('fa-IR')} مهر` : `${(day - 30).toLocaleString('fa-IR')} آبان`;
}

/** First day on which the forecast drops below the low-balance threshold, or -1. */
export function firstLowDay(forecast: number[], threshold = LOW_BALANCE): number {
  return forecast.findIndex((v) => v < threshold);
}

/** Validates an Iranian IBAN (شبا): IR + 24 digits with a valid ISO 13616 checksum. */
export function isValidSheba(input: string): boolean {
  const s = input.replace(/[\s-]/g, '').toUpperCase();
  if (!/^IR\d{24}$/.test(s)) return false;
  const rearranged = s.slice(4) + '1827' + s.slice(2, 4); // I=18, R=27
  let rem = 0;
  for (const ch of rearranged) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1;
}
