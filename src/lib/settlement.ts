// Early-settlement options. Fees are sample rates from the design draft; replace with the real tariff.
export interface SettlementOption {
  id: string;
  label: string;
  /** Short label for the fee row, e.g. "آنی" or "۱۴ روز زودتر". */
  short: string;
  feeRate: number;
  instant: boolean;
  arrival: string;
}

export const SETTLEMENT_OPTIONS: SettlementOption[] = [
  { id: 'instant', label: 'آنی · همین حالا', short: 'آنی', feeRate: 0.015, instant: true, arrival: 'آنی، در چند ثانیه' },
  { id: 'd5', label: '۵ روز زودتر', short: '۵ روز زودتر', feeRate: 0.004, instant: false, arrival: 'ظرف ۲۴ ساعت' },
  { id: 'd10', label: '۱۰ روز زودتر', short: '۱۰ روز زودتر', feeRate: 0.008, instant: false, arrival: 'ظرف ۲۴ ساعت' },
  { id: 'd14', label: '۱۴ روز زودتر', short: '۱۴ روز زودتر', feeRate: 0.011, instant: false, arrival: 'ظرف ۲۴ ساعت' },
  { id: 'd30', label: '۳۰ روز زودتر', short: '۳۰ روز زودتر', feeRate: 0.025, instant: false, arrival: 'ظرف ۲۴ ساعت' },
];

export const PENDING_SETTLEMENT = 238_400_000;

export function quoteEarlySettlement(amount: number, feeRate: number) {
  const fee = Math.round(amount * feeRate);
  return { fee, received: amount - fee };
}
