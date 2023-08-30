import { MaskitoOptions } from '@maskito/core';

export const MASK_SOZIALVERSICHERUNGSNUMMER: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
  ],
};

export const MASK_IBAN: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
  ],
};

export const MASK_MM_YYYY: MaskitoOptions = {
  mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/],
};

export const PATTERN_EMAIL = '^[a-z0-9]+[a-z0-9._-]*@[a-z0-9.-]+\\.[a-z]{2,4}$';
