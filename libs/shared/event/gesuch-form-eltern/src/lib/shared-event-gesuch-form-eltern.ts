import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';
import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';

export const SharedEventGesuchFormEltern = createActionGroup({
  source: 'GesuchFormEltern Eltern Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuchId: string;
      trancheId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: SharedModelGesuchFormStep;
    }>(),
    saveSubformTriggered: props<{
      gesuchId: string;
      trancheId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: SharedModelGesuchFormStep;
    }>(),
    nextTriggered: props<{
      id: string;
      origin: SharedModelGesuchFormStep;
    }>(),
  },
});
