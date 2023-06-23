import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { format, isAfter, isBefore, isValid } from 'date-fns';
import {
  acceptedDateInputFormatsDe,
  niceDateInputFormatDe,
  parseInputDateString,
} from './date-util';

export function maxDateValidatorForLocale(locale: Language, maxDate: Date) {
  return maxDateValidator(
    acceptedDateInputFormatsDe,
    new Date(),
    maxDate,
    niceDateInputFormatDe
  );
}
export function maxDateValidator(
  inputFormats: string[],
  referenceDate: Date,
  maxDate: Date,
  printFormat: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;
    if (!date) {
      return null;
    }
    const parsedDate = parseInputDateString(
      control.value,
      inputFormats,
      referenceDate
    );
    if (!parsedDate || !isValid(parsedDate)) {
      return null;
    }
    if (isAfter(parsedDate, maxDate)) {
      return {
        maxDate: {
          value: control.value,
          maxDate: format(maxDate, printFormat),
        },
      };
    }
    return null;
  };
}
