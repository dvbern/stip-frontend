import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';

export const GesuchAppEventGesuchFormEltern = createActionGroup({
  source: 'GesuchFormEltern Eltern Page',
  events: {
    init: emptyProps(),
    saveParentTriggered: props<{ gesuch: Partial<SharedModelGesuch> }>(),
    saveTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
