import {
  GesuchAppModelGesuchFormStep,
  NavigationType,
} from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventGesuchFormFamiliensituation = createActionGroup({
  source: 'GesuchFormFamiliensituation Page',
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
