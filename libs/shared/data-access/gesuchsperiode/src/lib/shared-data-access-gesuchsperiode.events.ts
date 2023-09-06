import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Gesuchsperiode } from '@dv/shared/model/gesuch';
import { SharedModelError } from '@dv/shared/model/error';

export const sharedDataAccessGesuchsperiodeEvents = createActionGroup({
  source: 'Gesuchsperiode API',
  events: {
    init: emptyProps(),
    gesuchsperiodesLoadedSuccess: props<{
      gesuchsperiodes: Gesuchsperiode[];
    }>(),
    gesuchsperiodesLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
