import { Language } from '@dv/shared/model/language';

const acceptedDateInputFormatsDe = [
  'dd.MM.yy',
  'dd.MM.yyyy',
  'ddMMyy',
  'ddMMyyyy',
]; // order matters! try it by entering 1.1.99 and 1.1.1999 and 31199
const niceDateInputFormatDe = 'dd.MM.yyyy';

const acceptedMonthYearInputFormatsDe = [
  'MM.yy',
  'MM.yyyy',
  'MMyy',
  'MMyyyy',
  ...acceptedDateInputFormatsDe, // man darf auch einen Tag angeben, wenn man gerne moechte
]; // order matters! try it by entering 1.1.99 and 1.1.1999 and 31199
const niceMonthYearInputFormatDe = 'MM.yyyy';

export type DateFormatVariant = 'date' | 'monthYear';

export interface DateFormatTypeDef {
  acceptedInputs: string[]; // user can use any of these acceted formats
  niceInput: string; // we show it in the nice format
}

const dateFormatsDE = new Map<DateFormatVariant, DateFormatTypeDef>();
const dateFormatsFR = new Map<DateFormatVariant, DateFormatTypeDef>();
const dateFormats = new Map<
  Language,
  Map<DateFormatVariant, DateFormatTypeDef>
>();

dateFormats.set('de', dateFormatsDE);
dateFormats.set('fr', dateFormatsFR);

dateFormatsDE.set('date', {
  acceptedInputs: acceptedDateInputFormatsDe,
  niceInput: niceDateInputFormatDe,
});
dateFormatsDE.set('monthYear', {
  acceptedInputs: acceptedMonthYearInputFormatsDe,
  niceInput: niceMonthYearInputFormatDe,
});

dateFormatsFR.set('date', {
  acceptedInputs: acceptedDateInputFormatsDe,
  niceInput: niceDateInputFormatDe,
});
dateFormatsFR.set('monthYear', {
  acceptedInputs: acceptedMonthYearInputFormatsDe,
  niceInput: niceMonthYearInputFormatDe,
});

export function getFormatDef(
  locale: Language,
  dateType: DateFormatVariant
): DateFormatTypeDef {
  return dateFormats.get(locale)!.get(dateType)!;
}
