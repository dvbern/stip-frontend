import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';
import { GesuchAppModelGesuchFormStep } from '@dv/shared/model/gesuch-form';

export const GesuchAppEventGesuchFormEltern = createActionGroup({
  source: 'GesuchFormEltern Eltern Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    saveSubformTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    nextTriggered: props<{
      id: string;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
