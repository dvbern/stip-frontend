import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventGesuchFormEducation = createActionGroup({
  source: 'GesuchFormEducation Page',
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
