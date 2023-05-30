import { MaskitoOptions } from '@maskito/core';

import { GesuchDTO } from './openapi/gesuchDTO';

export interface SharedModelGesuch extends GesuchDTO {
  view?: {
    // view specific props
  };
}

// TODO extract to env or generate with OpenAPI?
export const SHARED_MODEL_GESUCH_RESOURCE = `/gesuch`;

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
