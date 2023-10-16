import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

export const GesuchAppDataAccessAbschlussApiEvents = createActionGroup({
  source: 'Abschluss API',
  events: {
    gesuchAbschliessen: props<{
      gesuchId: string;
    }>(),
    abschlussSuccess: emptyProps(),
    abschlussFailure: props<{ error: SharedModelError }>(),
  },
});
