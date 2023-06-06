import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppEventGesuchFormPerson = createActionGroup({
  source: 'GesuchFormPerson Page',
  events: {
    init: emptyProps(),
    prevStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      target: GesuchAppModelGesuchFormStep; // TODO rename to origin?
    }>(),
    nextStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      target: GesuchAppModelGesuchFormStep; // TODO rename to origin?
    }>(),
  },
});