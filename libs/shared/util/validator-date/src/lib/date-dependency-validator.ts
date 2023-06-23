import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { parseDateForVariant } from '../index';
import { isAfter, isEqual } from 'date-fns';
import { DateFormatVariant } from './date-format-util';

export function createDateDependencyValidator(
  direction: 'before' | 'after',
  otherControl: FormControl<string | null>,
  allowEqual: boolean,
  referenceDate: Date,
  locale: Language,
  dateFormatVariant: DateFormatVariant
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const otherValue = otherControl.value;
    const myValue = control.value as string;
    return direction === 'before'
      ? validateStartBeforeEnd(
          myValue,
          otherValue,
          allowEqual,
          referenceDate,
          locale,
          dateFormatVariant
        )
      : validateStartBeforeEnd(
          otherValue,
          myValue,
          allowEqual,
          referenceDate,
          locale,
          dateFormatVariant
        );
  };
}

export function validateStartBeforeEnd(
  startValue: string | null,
  endValue: string | null,
  allowEqual: boolean,
  referenceDate: Date,
  locale: Language,
  dateFormatVariant: DateFormatVariant
): ValidationErrors | null {
  if (startValue && endValue) {
    const startDate = parseDateForVariant(
      startValue,
      new Date(),
      dateFormatVariant
    );
    const endDate = parseDateForVariant(
      endValue,
      new Date(),
      dateFormatVariant
    );

    if (startDate && endDate) {
      if (allowEqual && isEqual(endDate, startDate)) {
        return null;
      }
      return isAfter(endDate, startDate) ? null : { endDateAfterStart: true };
    }
  }
  return null;
}
