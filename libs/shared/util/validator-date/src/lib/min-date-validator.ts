import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { format, isBefore, isValid } from 'date-fns';
import {
  DateFormatVariant,
  getFormatDef,
  parseInputDateString,
} from '../index';

export function minDateValidatorForLocale(
  locale: Language,
  minDate: Date,
  dateFormatVariant: DateFormatVariant
) {
  return minDateValidator(locale, new Date(), minDate, dateFormatVariant);
}

export function minDateValidator(
  locale: Language,
  referenceDate: Date,
  minDate: Date,
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
    if (isBefore(parsedDate, minDate)) {
      return {
        minDate: {
          value: control.value,
          minDate: format(
            minDate,
            getFormatDef(locale, dateFormatVariant).niceInput
          ),
        },
      };
    }
    return null;
  };
}
