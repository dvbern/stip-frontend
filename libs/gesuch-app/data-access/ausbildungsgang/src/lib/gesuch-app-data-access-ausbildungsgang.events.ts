import { AusbildungsgangLand } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppDataAccessAusbildungsgangApiEvents = createActionGroup({
  source: 'Ausbildungsgang API',
  events: {
    ausbildungsgangsLoadedSuccess: props<{
      ausbildungsgangLands: AusbildungsgangLand[];
    }>(),
    ausbildungsgangsLoadedFailure: props<{ error: string }>(),
  },
});
