import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';
import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';

export const SharedEventGesuchFormFamiliensituation = createActionGroup({
  source: 'GesuchFormFamiliensituation Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: SharedModelGesuchFormStep;
    }>(),
  },
});
