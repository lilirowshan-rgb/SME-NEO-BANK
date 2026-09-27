import { PENDING_SETTLEMENT, SETTLEMENT_OPTIONS, quoteEarlySettlement } from './settlement';

it('matches the design sample for 14 days early', () => {
  expect(quoteEarlySettlement(PENDING_SETTLEMENT, 0.011)).toEqual({ fee: 2_622_400, received: 235_777_600 });
});

it('offers instant settlement first', () => {
  expect(SETTLEMENT_OPTIONS[0]).toMatchObject({ id: 'instant', instant: true });
  expect(quoteEarlySettlement(PENDING_SETTLEMENT, SETTLEMENT_OPTIONS[0].feeRate)).toEqual({ fee: 3_576_000, received: 234_824_000 });
});
