import { quoteSupplierPayment } from './supplier';

it('pays the supplier the discounted amount and charges the merchant the full invoice', () => {
  const q = quoteSupplierPayment(100_000_000, 60, 0.3);
  expect(q.discount).toBe(4_931_507);
  expect(q.supplierReceives).toBe(95_068_493);
  expect(q.merchantPays).toBe(100_000_000);
  expect(q.supplierReceives + q.discount).toBe(q.merchantPays);
});

it('scales the discount with the number of days', () => {
  expect(quoteSupplierPayment(100_000_000, 30, 0.3).discount).toBeLessThan(quoteSupplierPayment(100_000_000, 90, 0.3).discount);
});
