import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppEventGesuchFormEducation = createActionGroup({
  source: 'GesuchFormEducation Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
