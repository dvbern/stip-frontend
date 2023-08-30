import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Language } from '@dv/shared/model/language';
import { parseDateForVariant } from '../index';
import { isAfter, isEqual, areIntervalsOverlapping } from 'date-fns';
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

export function createOverlappingValidator(
  minDateControl: FormControl<string | null>,
  intervalValues: Readonly<[string, string]>[],
  referenceDate: Date,
  dateFormatVariant: DateFormatVariant
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minDate = parseDateForVariant(
      minDateControl.value,
      new Date(),
      dateFormatVariant
    );
    const maxDate = parseDateForVariant(
      control.value,
      new Date(),
      dateFormatVariant
    );
    const intervals = intervalValues.map(([start, end]) => [
      parseDateForVariant(start, referenceDate, dateFormatVariant),
      parseDateForVariant(end, referenceDate, dateFormatVariant),
    ]);

    if (!minDate || !maxDate || (minDate && maxDate && maxDate < minDate)) {
      return null;
    }

    const hasOverlaps = intervals.some(([start, end]) => {
      if (!start || !end) {
        return false;
      }
      const isOverlapping = areIntervalsOverlapping(
        { start: minDate, end: maxDate },
        { start, end }
      );
      return (
        isOverlapping ||
        isOnIntervalLimits(minDate, start, end) ||
        isOnIntervalLimits(maxDate, start, end)
      );
    });
    return hasOverlaps ? { overlapsOthers: true } : null;
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

const isOnIntervalLimits = (date: Date, start: Date, end: Date) => {
  return date !== null && (isEqual(date, start) || isEqual(date, end));
};
