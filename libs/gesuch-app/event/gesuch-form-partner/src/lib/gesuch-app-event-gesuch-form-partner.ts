import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';

export const GesuchAppEventGesuchFormPartner = createActionGroup({
  source: 'GesuchFormPartner Page',
  events: {
    init: emptyProps(),
    prevStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    nextStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
