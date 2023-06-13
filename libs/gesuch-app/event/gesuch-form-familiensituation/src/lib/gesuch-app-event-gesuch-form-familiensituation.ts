import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppEventGesuchFormFamiliensituation = createActionGroup({
  source: 'GesuchFormFamiliensituation Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
