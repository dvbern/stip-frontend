import { createActionGroup, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { Ausbildungsstaette } from '@dv/shared/model/gesuch';

export const GesuchAppDataAccessAusbildungstaetteApiEvents = createActionGroup({
  source: 'Ausbildungstaette API',
  events: {
    ausbildungstaettesLoadedSuccess: props<{
      ausbildungstaettes: Ausbildungsstaette[];
    }>(),
    ausbildungstaettesLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
