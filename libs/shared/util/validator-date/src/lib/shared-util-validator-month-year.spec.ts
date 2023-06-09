import { FormControl } from '@angular/forms';
import {
  sharedUtilIsValidMonthYearMonth,
  sharedUtilIsValidMonthYearYear,
  sharedUtilValidatorMonthYear,
  sharedUtilValidatorMonthYearMonth,
} from './shared-util-validator-month-year';

describe('monthYear: is valid month', () => {
  it.each([
    // valid month:
    ['00.2023', false],
    ['01.2023', true],
    ['02.2023', true],
    ['03.2023', true],
    ['04.2023', true],
    ['05.2023', true],
    ['06.2023', true],
    ['07.2023', true],
    ['08.2023', true],
    ['09.2023', true],
    ['10.2023', true],
    ['11.2023', true],
    ['12.2023', true],
    ['13.2023', false],
    ['14.2023', false],
  ])(
    "Datemonth  '%s' should be valid='%s'",
    (original: string, expectedValid: boolean) => {
      expect(sharedUtilIsValidMonthYearMonth(original)).toEqual(expectedValid);
    }
  );
});
describe('monthYear: is valid year', () => {
  it.each([
    // min/max year:
    ['12.2022', 2023, 2024, false],
    ['01.2023', 2023, 2024, true],
    ['12.2024', 2023, 2024, true],
    ['01.2025', 2023, 2024, false],
  ])(
    "Datemonth  '%s' (min='%s', max='%s') should be valid='%s'",
    (
      original: string,
      minYear: number,
      maxYear: number,
      expectedValid: boolean
    ) => {
      expect(
        sharedUtilIsValidMonthYearYear(original, minYear, maxYear)
      ).toEqual(expectedValid);
    }
  );
});

describe('monthYear validator: month', () => {
  it.each([
    // valid month:
    ['00.2023', false],
    ['01.2023', true],
    ['02.2023', true],
    ['03.2023', true],
    ['04.2023', true],
    ['05.2023', true],
    ['06.2023', true],
    ['07.2023', true],
    ['08.2023', true],
    ['09.2023', true],
    ['10.2023', true],
    ['11.2023', true],
    ['12.2023', true],
    ['13.2023', false],
    ['14.2023', false],
  ])(
    "Datemonth  '%s' should be validMonth='%s'",
    (original: string, validMonth: boolean) => {
      const mock = new FormControl(original);
      expect(sharedUtilValidatorMonthYearMonth(mock)).toEqual(
        validMonth ? null : { monthYearMonth: true }
      );
    }
  );
});

describe('monthYear validator: year', () => {
  it.each([
    // min/max year:
    ['12.2022', 2023, 2024, false],
    ['01.2023', 2023, 2024, true],
    ['12.2024', 2023, 2024, true],
    ['01.2025', 2023, 2024, false],
  ])(
    "Datemonth  '%s' (min='%s', max='%s') should be  validYear='%s'",
    (
      original: string,
      minYear: number,
      maxYear: number,
      validYear: boolean
    ) => {
      const mock = new FormControl(original);
      const yearValidator = sharedUtilValidatorMonthYear(minYear, maxYear);
      expect(yearValidator(mock)).toEqual(
        validYear ? null : { monthYearYear: { min: minYear, max: maxYear } }
      );
    }
  );
});
