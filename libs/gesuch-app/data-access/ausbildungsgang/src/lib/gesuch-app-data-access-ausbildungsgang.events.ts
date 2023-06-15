import { createActionGroup, props } from '@ngrx/store';

import { AusbildungsgangLand } from '@dv/shared/model/gesuch';
import { SharedModelError } from '@dv/shared/model/error';

export const GesuchAppDataAccessAusbildungsgangApiEvents = createActionGroup({
  source: 'Ausbildungsgang API',
  events: {
    ausbildungsgangsLoadedSuccess: props<{
      ausbildungsgangLands: AusbildungsgangLand[];
    }>(),
    ausbildungsgangsLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
