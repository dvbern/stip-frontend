import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { isValid } from 'date-fns';
import {
  acceptedDateInputFormatsDe,
  parseInputDateString,
  printDate,
} from './date-util';

export function parseableDateValidatorForLocale(locale: Language) {
  return parseableDateValidator(locale, new Date());
}

export function parseDateForLocale(
  val: string | null | undefined,
  referenceDate: Date,
  locale: Language
): Date | null {
  if (!val) {
    return null;
  }
  const parsed = parseInputDateString(
    val,
    acceptedDateInputFormatsDe,
    referenceDate
  );
  if (!!parsed && isValid(parsed)) {
    return parsed;
  }
  return null;
}

export function parseableDateValidator(locale: Language, referenceDate: Date) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      const parsed = parseDateForLocale(control.value, referenceDate, locale);
      if (!!parsed && isValid(parsed)) {
        return null;
      } else {
        return {
          dateFormat: true,
        };
      }
    }
  };
}

export function onDateInputBlur(
  control: FormControl,
  referenceDate: Date,
  locale: Language
) {
  const val = control.value;
  const date = parseDateForLocale(val, referenceDate, locale);
  if (date) {
    control.patchValue(printDate(date, locale));
  }
}
