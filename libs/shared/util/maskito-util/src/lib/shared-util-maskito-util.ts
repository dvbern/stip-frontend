import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export const maskitoPercent = maskitoNumberOptionsGenerator({
  postfix: '%',
  min: 0,
  max: 100,
  precision: 2,
});
