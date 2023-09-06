import { createActionGroup, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { Ausbildungsstaette } from '@dv/shared/model/gesuch';

export const SharedDataAccessAusbildungsstaetteApiEvents = createActionGroup({
  source: 'Ausbildungsstaette API',
  events: {
    ausbildungsstaettesLoadedSuccess: props<{
      ausbildungsstaettes: Ausbildungsstaette[];
    }>(),
    ausbildungsstaettesLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
