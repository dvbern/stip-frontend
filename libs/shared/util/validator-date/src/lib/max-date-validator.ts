import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { format, isAfter, isValid } from 'date-fns';
import { DateFormatVariant, getFormatDef } from './date-format-util';
import { parseInputDateString } from './date-util';

export function maxDateValidatorForLocale(
  locale: Language,
  maxDate: Date,
  dateFormatVariant: DateFormatVariant
) {
  return maxDateValidator(locale, new Date(), maxDate, dateFormatVariant);
}

export function maxDateValidator(
  locale: Language,
  referenceDate: Date,
  maxDate: Date,
  dateFormatVariant: DateFormatVariant
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;
    if (!date) {
      return null;
    }
    const parsedDate = parseInputDateString(
      control.value,
      getFormatDef(locale, dateFormatVariant).acceptedInputs,
      referenceDate
    );
    if (!parsedDate || !isValid(parsedDate)) {
      return null;
    }
    if (isAfter(parsedDate, maxDate)) {
      return {
        maxDate: {
          value: control.value,
          maxDate: format(
            maxDate,
            getFormatDef(locale, dateFormatVariant).niceInput
          ),
        },
      };
    }
    return null;
  };
}
