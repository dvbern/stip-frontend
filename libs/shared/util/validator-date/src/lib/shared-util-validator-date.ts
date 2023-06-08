import { FormControl, ValidationErrors } from '@angular/forms';

export function sharedUtilIsValidMonthYear(monthYear: string) {
  const [month, year] = monthYear.split('.').map((value) => +value);

  const validMonth = month > 0 && month < 13;
  const validYear = year > 1900 && year < 3000; // TODO specify the ranges

  return validMonth && validYear;
}

export function sharedUtilValidatorMonthYear(
  control: FormControl
): ValidationErrors | null {
  if (!control?.value) {
    return null;
  } else {
    return sharedUtilIsValidMonthYear(control.value)
      ? null
      : { monthYear: true };
  }
}
