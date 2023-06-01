import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppEventGesuchFormPerson = createActionGroup({
  source: 'GesuchFormPerson Page',
  events: {
    init: emptyProps(),
    prevStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      target: string;
    }>(),
    nextStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      target: string;
    }>(),
  },
});
