import { createActionGroup, props } from '@ngrx/store';

import { GesuchsperiodeDTO } from '@dv/shared/model/gesuch';
import { SharedModelError } from '@dv/shared/model/error';

export const GesuchAppDataAccessGesuchsperiodeEvents = createActionGroup({
  source: 'Gesuchsperiode API',
  events: {
    gesuchsperiodesLoadedSuccess: props<{
      gesuchsperiodes: GesuchsperiodeDTO[];
    }>(),
    gesuchsperiodesLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
