import { profitAndLoss } from './accounting';

it('reproduces the summer P&L from the design', () => {
  const p = profitAndLoss();
  expect(p.net).toBe(3775.8);
  expect(p.totalExpenses).toBe(3382.1);
  expect(p.profit).toBe(393.7);
  expect(p.margin).toBeCloseTo(10.4, 1);
});
