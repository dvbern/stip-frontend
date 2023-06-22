import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import {
  inputParseDateFormatsDe,
  inputPrintDateFormatDe,
  parseInputDateString,
} from '../index';
import { format, isAfter, isBefore, isValid } from 'date-fns';

export function minDateValidatorForLocale(locale: Language, minDate: Date) {
  return minDateValidator(
    inputParseDateFormatsDe,
    new Date(),
    minDate,
    inputPrintDateFormatDe
  );
}
export function minDateValidator(
  inputFormats: string[],
  referenceDate: Date,
  minDate: Date,
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
    if (isBefore(parsedDate, minDate)) {
      return {
        minDate: {
          value: control.value,
          minDate: format(minDate, printFormat),
        },
      };
    }
    return null;
  };
}
