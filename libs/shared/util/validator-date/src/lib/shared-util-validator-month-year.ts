import { FormControl, ValidationErrors } from '@angular/forms';

export function sharedUtilIsValidMonthYearMonth(monthYear: string) {
  const [month, _] = monthYear.split('.').map((value) => +value);
  const validMonth = month > 0 && month < 13;
  return validMonth;
}

export function sharedUtilIsValidMonthYearYear(
  monthYear: string,
  minYear: number,
  maxYear: number
) {
  const [_, year] = monthYear.split('.').map((value) => +value);
  const validYear = year >= minYear && year <= maxYear;
  return validYear;
}

export function sharedUtilValidatorMonthYearMonth(
  control: FormControl
): ValidationErrors | null {
  if (!control?.value) {
    return null;
  } else {
    return sharedUtilIsValidMonthYearMonth(control.value)
      ? null
      : {
          monthYearMonth: true,
        };
  }
}

export function sharedUtilValidatorMonthYear(minYear: number, maxYear: number) {
  return (control: FormControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      return sharedUtilIsValidMonthYearYear(control.value, minYear, maxYear)
        ? null
        : {
            monthYearYear: { min: minYear, max: maxYear },
          };
    }
  };
}
