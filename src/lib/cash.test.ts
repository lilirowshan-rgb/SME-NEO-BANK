import { FORECAST, firstLowDay, forecastDate, isValidSheba } from './cash';

it('labels forecast dates across the month boundary', () => {
  expect(forecastDate(0)).toBe('۵ مهر');
  expect(forecastDate(25)).toBe('۳۰ مهر');
  expect(forecastDate(29)).toBe('۴ آبان');
});

it('finds the first low-balance day (30 Mehr in the sample)', () => {
  expect(FORECAST).toHaveLength(30);
  expect(forecastDate(firstLowDay(FORECAST))).toBe('۳۰ مهر');
});

it('validates sheba checksums', () => {
  expect(isValidSheba('IR06 2960 0000 0010 0324 2000 01')).toBe(true);
  expect(isValidSheba('IR06 2960 0000 0010 0324 2000 02')).toBe(false);
  expect(isValidSheba('IR12')).toBe(false);
});
