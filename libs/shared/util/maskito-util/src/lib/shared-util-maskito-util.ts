import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export const maskitoPercent = maskitoNumberOptionsGenerator({
  postfix: '%',
  isNegativeAllowed: false,
  max: 100,
  precision: 2,
});
