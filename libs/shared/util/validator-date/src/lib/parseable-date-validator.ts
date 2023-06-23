import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { isValid } from 'date-fns';
import { DateFormatVariant, getFormatDef } from './date-format-util';
import { parseInputDateString, printDate } from './date-util';

export function parseableDateValidatorForLocale(
  locale: Language,
  dateFormatVariant: DateFormatVariant
) {
  return parseableDateValidator(locale, new Date(), dateFormatVariant);
}

export function parseDateForVariant(
  val: string | null | undefined,
  referenceDate: Date,
  dateFormatVariant: DateFormatVariant
): Date | null {
  if (!val) {
    return null;
  }
  const parsed = parseInputDateString(
    val,
    getFormatDef('de', dateFormatVariant).acceptedInputs,
    referenceDate
  );
  if (!!parsed && isValid(parsed)) {
    return parsed;
  }
  return null;
}

function parseableDateValidator(
  locale: Language,
  referenceDate: Date,
  dateFormatVariant: DateFormatVariant
) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      const parsed = parseDateForVariant(
        control.value,
        referenceDate,
        dateFormatVariant
      );
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
  onDateInputBlurBasic(control, referenceDate, locale, 'date');
}

export function onMonthYearInputBlur(
  control: FormControl,
  referenceDate: Date,
  locale: Language
) {
  onDateInputBlurBasic(control, referenceDate, locale, 'monthYear');
}

export function onDateInputBlurBasic(
  control: FormControl,
  referenceDate: Date,
  locale: Language,
  dateFormatVariant: DateFormatVariant
) {
  const val = control.value;
  const date = parseDateForVariant(val, referenceDate, dateFormatVariant);
  if (date) {
    control.patchValue(printDate(date, locale, dateFormatVariant));
  }
}
