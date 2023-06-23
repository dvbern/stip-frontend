import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { LandDTO } from '@dv/shared/model/gesuch';

export const SharedDataAccessStammdatenApiEvents = createActionGroup({
  source: 'Stammdaten API',
  events: {
    // TODO remove dummy
    init: emptyProps(),
    // TODO interface should come from a model lib
    stammdatensLoadedSuccess: props<{ laender: LandDTO[] }>(),
    stammdatensLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
