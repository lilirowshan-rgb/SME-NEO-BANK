import { PENDING_SETTLEMENT, quoteEarlySettlement } from './settlement';

it('matches the design sample for 14 days early', () => {
  expect(quoteEarlySettlement(PENDING_SETTLEMENT, 0.011)).toEqual({ fee: 2_622_400, received: 235_777_600 });
});
