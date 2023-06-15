import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { isAfter, isEqual } from 'date-fns';

export function sharedUtilIsValidMonthYearMonth(monthYear: string) {
  const [month, _] = monthYear.split('.').map((value) => +value);
  const validMonth = month > 0 && month < 13;
  return validMonth;
}

export function sharedUtilIsValidMonthYearMin(
  monthYear: string,
  minYear: number
) {
  const year = parseMonthYearString(monthYear).year;
  const validYear = year >= minYear;
  return validYear;
}

export function sharedUtilIsValidMonthYearMax(
  monthYear: string,
  maxYear: number
) {
  const year = parseMonthYearString(monthYear).year;
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

export function createValidatorEndAfterStart(
  startControl: FormControl<string | null>,
  allowEqual: boolean
) {
  return (control: AbstractControl): ValidationErrors | null => {
    const startValue = startControl.value;
    const endValue = control.value as string;
    return validateStartBeforeEnd(startValue, endValue, allowEqual);
  };
}

export function createValidatorStartBeforeEnd(
  endControl: FormControl<string | null>,
  allowEqual: boolean
) {
  return (control: AbstractControl): ValidationErrors | null => {
    const startValue = control.value as string;
    const endValue = endControl.value;
    return validateStartBeforeEnd(startValue, endValue, allowEqual);
  };
}

export function validateStartBeforeEnd(
  startValue: string | null,
  endValue: string | null,
  allowEqual: boolean
): ValidationErrors | null {
  if (startValue && endValue) {
    const start = parseMonthYearString(startValue);
    const end = parseMonthYearString(endValue);

    const startDate = new Date(start.year, start.month - 1);
    const endDate = new Date(end.year, end.month - 1);

    if (allowEqual && isEqual(endDate, startDate)) {
      return null;
    }
    return isAfter(endDate, startDate) ? null : { endDateAfterStart: true };
  }
  return null;
}

export function parseMonthYearString(monthYear: string): {
  month: number;
  year: number;
} {
  const [month, year] = monthYear.split('.').map((value) => +value);
  return { month, year };
}
