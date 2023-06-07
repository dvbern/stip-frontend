import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {GesuchAppModelGesuchFormStep, NavigationType} from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppEventGesuchFormPerson = createActionGroup({
  source: 'GesuchFormPerson Page',
  events: {
    init: emptyProps(),
    prevStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
      navigationType: NavigationType;
    }>(),
    nextStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
      navigationType: NavigationType;
    }>(),
  },
});
