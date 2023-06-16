import { createActionGroup, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { AusbildungstaetteDTO } from '@dv/shared/model/gesuch';

export const GesuchAppDataAccessAusbildungstaetteApiEvents = createActionGroup({
  source: 'Ausbildungstaette API',
  events: {
    ausbildungstaettesLoadedSuccess: props<{
      ausbildungstaettes: AusbildungstaetteDTO[];
    }>(),
    ausbildungstaettesLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
