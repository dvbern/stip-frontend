import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';

export const GesuchAppEventGesuchFormPerson = createActionGroup({
  source: 'GesuchFormPerson Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
