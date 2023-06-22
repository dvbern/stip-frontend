import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { inputParseDateFormatsDe, parseInputDateString } from './date-util';
import { isValid } from 'date-fns';

export function parseableDateValidatorForLocale(locale: Language) {
  return parseableDateValidator(inputParseDateFormatsDe, new Date());
}

export function parseableDateValidator(
  inputFormats: string[],
  referenceDate: Date
) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control?.value) {
      return null;
    } else {
      const parsed = parseInputDateString(
        control.value,
        inputFormats,
        referenceDate
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
