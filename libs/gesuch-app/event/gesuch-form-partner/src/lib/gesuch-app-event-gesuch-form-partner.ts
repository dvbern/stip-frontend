import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';
import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';

export const GesuchAppEventGesuchFormPartner = createActionGroup({
  source: 'GesuchFormPartner Page',
  events: {
    init: emptyProps(),
    prevStepTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    nextStepTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
