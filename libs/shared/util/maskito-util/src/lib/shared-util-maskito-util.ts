import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export const NUMBER_THOUSAND_SEPARATOR = "'";

export const maskitoPercent = maskitoNumberOptionsGenerator({
  postfix: '%',
  min: 0,
  max: 100,
  precision: 2,
});

export const maskitoNumber = maskitoNumberOptionsGenerator({
  min: 0,
  thousandSeparator: NUMBER_THOUSAND_SEPARATOR,
});

export const maskitoPositiveNumber = maskitoNumberOptionsGenerator({
  min: 1,
  thousandSeparator: NUMBER_THOUSAND_SEPARATOR,
});

export function fromFormatedNumber(formatedNumber: string): number;
export function fromFormatedNumber(
  formatedNumber: string | null
): number | null;
export function fromFormatedNumber(
  formatedNumber: string | undefined
): number | undefined;
export function fromFormatedNumber(
  formatedNumber: string | null | undefined
): number | null | undefined {
  if (formatedNumber === '' || formatedNumber?.trim() === '') {
    return null;
  }
  return formatedNumber != null
    ? +formatedNumber.replaceAll(NUMBER_THOUSAND_SEPARATOR, '')
    : formatedNumber;
}
