import { quoteLoan } from './loan';

describe('quoteLoan', () => {
  it('computes an amortized installment', () => {
    const q = quoteLoan(600e6, 6, 23);
    expect(q.installment).toBeCloseTo(106_814_443, 0);
    expect(q.totalRepayment).toBeCloseTo(q.installment * 6);
    expect(q.fee).toBe(6e6);
  });

  it('splits evenly at zero interest', () => {
    expect(quoteLoan(1200, 12, 0).installment).toBe(100);
  });
});
