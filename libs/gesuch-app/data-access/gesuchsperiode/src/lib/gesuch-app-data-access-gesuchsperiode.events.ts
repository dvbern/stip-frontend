import { createActionGroup, props } from '@ngrx/store';

import { Gesuchsperiode } from '@dv/shared/model/gesuch';
import { SharedModelError } from '@dv/shared/model/error';

export const GesuchAppDataAccessGesuchsperiodeEvents = createActionGroup({
  source: 'Gesuchsperiode API',
  events: {
    gesuchsperiodesLoadedSuccess: props<{
      gesuchsperiodes: Gesuchsperiode[];
    }>(),
    gesuchsperiodesLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
