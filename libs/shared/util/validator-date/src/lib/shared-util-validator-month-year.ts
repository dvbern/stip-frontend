import { FormControl, ValidationErrors } from '@angular/forms';

export function sharedUtilIsValidMonthYearMonth(monthYear: string) {
  const [month, _] = monthYear.split('.').map((value) => +value);
  const validMonth = month > 0 && month < 13;
  return validMonth;
}

export function sharedUtilIsValidMonthYearMin(
  monthYear: string,
  minYear: number
) {
  const [_, year] = monthYear.split('.').map((value) => +value);
  const validYear = year >= minYear;
  return validYear;
}

export function sharedUtilIsValidMonthYearMax(
  monthYear: string,
  maxYear: number
) {
  const [_, year] = monthYear.split('.').map((value) => +value);
  const validYear = year <= maxYear;
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

export function sharedUtilValidatorMonthYearMin(minYear: number) {
  return (control: FormControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      return sharedUtilIsValidMonthYearMin(control.value, minYear)
        ? null
        : {
            monthYearYearMin: { min: minYear },
          };
    }
  };
}

export function sharedUtilValidatorMonthYearMax(maxYear: number) {
  return (control: FormControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      return sharedUtilIsValidMonthYearMax(control.value, maxYear)
        ? null
        : {
            monthYearYearMax: { max: maxYear },
          };
    }
  };
}
