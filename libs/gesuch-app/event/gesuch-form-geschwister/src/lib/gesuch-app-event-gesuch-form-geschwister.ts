import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventGesuchFormGeschwister = createActionGroup({
  source: 'GesuchFormGeschwister Geschwister Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    saveSubformTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    nextTriggered: props<{
      id: string;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
