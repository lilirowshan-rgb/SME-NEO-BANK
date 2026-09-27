import { estimateCampaign } from './ads';

it('estimates clicks, orders and sales from a daily budget', () => {
  const e = estimateCampaign(600_000);
  expect(e.clicks).toBe(400);
  expect(e.orders).toBe(10);
  expect(e.sales).toBe(42_000_000);
  expect(e.roas).toBe(70);
  expect(estimateCampaign(0).roas).toBe(0);
});
