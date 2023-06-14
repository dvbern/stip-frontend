import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventGesuchFormAuszahlung = createActionGroup({
  source: 'GesuchFormAuszahlung Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
  },
});
