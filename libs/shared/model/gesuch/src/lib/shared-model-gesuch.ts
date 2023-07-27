import { Gesuch } from './openapi/gesuch';
import { GesuchFormularUpdate } from './openapi/gesuchFormularUpdate';

export interface SharedModelGesuch extends Gesuch {
  view?: {
    // view specific props
  };
}

export interface SharedModelGesuchFormular extends GesuchFormularUpdate {
  freigegeben: boolean;
}

// TODO extract to env or generate with OpenAPI?
export const SHARED_MODEL_GESUCH_RESOURCE = `/gesuch`;
export const SHARED_MODEL_GESUCHSPERIODE_RESOURCE = `/gesuchsperiode`;

export enum GesuchsperiodeSemester {
  HERBST = 'HERBST',
  FRUEHLING = 'FRUEHLING',
}
