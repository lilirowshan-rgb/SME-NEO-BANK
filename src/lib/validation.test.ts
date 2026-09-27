import { isValidJalaliDate, isValidMobile, isValidNationalCode } from './validation';

it('checks national codes', () => {
  expect(isValidNationalCode('0012345679')).toBe(true);
  expect(isValidNationalCode('۰۰۱۲۳۴۵۶۷۹')).toBe(true);
  expect(isValidNationalCode('0012345678')).toBe(false);
  expect(isValidNationalCode('1111111111')).toBe(false);
  expect(isValidNationalCode('12345')).toBe(false);
});

it('checks mobile numbers', () => {
  expect(isValidMobile('0912 345 6789')).toBe(true);
  expect(isValidMobile('+989123456789')).toBe(true);
  expect(isValidMobile('0812 345 6789')).toBe(false);
});

it('checks jalali dates', () => {
  expect(isValidJalaliDate('1365/04/12')).toBe(true);
  expect(isValidJalaliDate('۱۳۶۵/۰۴/۱۲')).toBe(true);
  expect(isValidJalaliDate('1365/13/01')).toBe(false);
  expect(isValidJalaliDate('1365/08/31')).toBe(false);
});
