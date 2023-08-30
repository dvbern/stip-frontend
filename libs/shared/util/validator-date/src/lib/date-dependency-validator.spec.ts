import { FormControl } from '@angular/forms';
import { createOverlappingValidator } from './date-dependency-validator';

describe('validator-date', () => {
  const no = null;
  const yes = { overlapsOthers: true };

  it.each([
    ['01.2022', null, ['02.2023', '01.2024'], null, no],
    [null, '01.2022', ['02.2023', '01.2024'], null, no],
    ['01.2022', '01.2023', ['02.2023', '01.2024'], null, no],
    ['01.2022', '01.2023', ['01.2023', '01.2024'], null, yes],
    ['01.2022', '02.2023', ['01.2023', '01.2024'], null, yes],
    ['01.2022', '02.2024', ['01.2023', '01.2024'], null, yes],
    ['02.2022', '01.2023', ['01.2019', '01.2022'], ['02.2023', '01.2024'], no],
    ['01.2022', '01.2023', ['01.2019', '01.2022'], ['01.2023', '01.2024'], yes],
    ['12.2021', '01.2023', ['01.2019', '01.2022'], ['01.2023', '01.2024'], yes],
    ['12.2018', '02.2024', ['01.2019', '01.2022'], ['01.2023', '01.2024'], yes],
    ['01.2022', '02.2023', ['01.2019', '01.2022'], ['01.2023', '01.2024'], yes],
  ] as const)(
    'should check for overlapping dates with min[%s] max[%s] in { range1: %s, range2: %s }',
    (minDate, maxDate, range1, range2, expectedValue) => {
      const controlMin = new FormControl(minDate);
      const controlMax = new FormControl(maxDate);
      const validator = createOverlappingValidator(
        controlMin,
        range2 ? [range1, range2] : [range1],
        new Date(),
        'monthYear'
      );
      expect(validator(controlMax)).toStrictEqual(expectedValue);
    }
  );
});
