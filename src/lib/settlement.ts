// Early-settlement fee tiers from the design draft (sample rates, to be replaced with the real tariff).
export const EARLY_SETTLEMENT_OPTIONS = [
  { days: 5, feeRate: 0.004 },
  { days: 10, feeRate: 0.008 },
  { days: 14, feeRate: 0.011 },
  { days: 30, feeRate: 0.025 },
] as const;

export const PENDING_SETTLEMENT = 238_400_000;

export function quoteEarlySettlement(amount: number, feeRate: number) {
  const fee = Math.round(amount * feeRate);
  return { fee, received: amount - fee };
}
