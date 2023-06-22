import {
  BackendLocalDateTS,
  fromBackendLocalDate,
  toBackendLocalDate,
} from '@dv/shared/model/gesuch';
import { Language } from '@dv/shared/model/language';
import { format, formatISO, isValid, Locale, parse } from 'date-fns';

// TODO language dependent input formats?
export const inputParseDateFormatsDe = ['dd.MM.yy', 'dd.MM.yyyy']; // order matters! try it by entering 1.1.99 and 1.1.1999
export const inputPrintDateFormatDe = 'dd.MM.yyyy';

export function parseBackendLocalDateAndPrint(
  value: BackendLocalDateTS | null | undefined,
  locale: Language
) {
  return formatBackendLocalDate(value, inputPrintDateFormatDe);
}

export function formatBackendLocalDate(
  value: BackendLocalDateTS | null | undefined,
  formt: string
) {
  if (value === null || value === undefined) {
    return undefined;
  }
  const date = fromBackendLocalDate(value);
  if (date === undefined) {
    return undefined;
  }
  return format(date, formt);
}

export function parseStringAndPrintForBackendLocalDate(
  value: BackendLocalDateTS | null | undefined,
  locale: Language,
  referenceDate: Date
) {
  return asBackendLocalDate(value, inputParseDateFormatsDe, referenceDate);
}

export function parseInputDateStringVariants(
  value: string | null | undefined,
  srcFormats: string[]
) {
  if (value === null || value === undefined) {
    return undefined;
  }
  const parsedDates = srcFormats.map((srcFormat) =>
    parse(value, srcFormat, new Date())
  );
  return parsedDates;
}

export function parseInputDateString(
  value: string | null | undefined,
  srcFormats: string[],
  referenceDate: Date
) {
  if (value === null || value === undefined) {
    return undefined;
  }
  // the reference date is used with 'yy' to guess the closest date
  const parsedDates = srcFormats.map((srcFormat) =>
    parse(value, srcFormat, referenceDate)
  );
  const validDates = parsedDates.filter((each) => isValid(each));
  if (validDates.length) {
    return validDates[0];
  }
  return undefined;
}
export function asBackendLocalDate(
  value: string | null | undefined,
  srcFormats: string[],
  referenceDate: Date
) {
  const date = parseInputDateString(value, srcFormats, referenceDate);
  if (date === undefined || !isValid(date)) {
    return undefined;
  }
  return toBackendLocalDate(date);
}
