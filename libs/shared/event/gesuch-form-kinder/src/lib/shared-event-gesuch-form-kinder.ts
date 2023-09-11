import { GesuchAppModelGesuchFormStep } from '@dv/shared/model/gesuch-form';
import { SharedModelGesuchFormular } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SharedEventGesuchFormKinder = createActionGroup({
  source: 'GesuchFormKinder Page',
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
