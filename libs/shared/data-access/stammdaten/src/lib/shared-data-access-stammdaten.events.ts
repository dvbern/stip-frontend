import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { Land } from '@dv/shared/model/gesuch';

export const SharedDataAccessStammdatenApiEvents = createActionGroup({
  source: 'Stammdaten API',
  events: {
    init: emptyProps(),
    stammdatensLoadedSuccess: props<{ laender: Land[] }>(),
    stammdatensLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
