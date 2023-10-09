import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';
import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SharedEventGesuchFormAbschluss = createActionGroup({
  source: 'GesuchFormAbschluss Page',
  events: {
    init: emptyProps(),
    saveTriggered: props<{
      gesuchId: string;
      gesuchFormular: Partial<SharedModelGesuchFormular>;
      origin: SharedModelGesuchFormStep;
    }>(),
  },
});
