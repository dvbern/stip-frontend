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

export const fromFormatedNumber = (formatedNumber: string): number | null => {
  return +formatedNumber.replace(NUMBER_THOUSAND_SEPARATOR, '');
};
