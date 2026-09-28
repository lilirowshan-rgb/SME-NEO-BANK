import { summarize } from './sales';

const none = { bank: false, moadian: false, cashLogged: false };

it('matches today\'s limit when only DigiPay channels are visible', () => {
  expect(summarize(none)).toMatchObject({ known: 1240, verified: 1240, limit: 850 });
});

it('raises the limit as more sources are connected', () => {
  const bank = summarize({ ...none, bank: true });
  const bankTax = summarize({ ...none, bank: true, moadian: true });
  const all = summarize({ bank: true, moadian: true, cashLogged: true });
  expect(bank.limit).toBe(1600);
  expect(bankTax.limit).toBe(1750);
  expect(all.limit).toBe(1850);
  expect(all.known).toBe(2920);
  expect(all.coverage).toBeCloseTo(1240 / 2920);
});

it('counts declared cash at a quarter of its value', () => {
  const cash = summarize({ ...none, cashLogged: true });
  expect(cash.weighted).toBeCloseTo(1240 + 350 * 0.25);
});
