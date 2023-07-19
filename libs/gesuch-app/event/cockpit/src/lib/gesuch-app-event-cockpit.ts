import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GesuchCreate } from '@dv/shared/model/gesuch';

export const GesuchAppEventCockpit = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
    newTriggered: props<{
      create: GesuchCreate;
    }>(),
    removeTriggered: props<{ id: string }>(),
  },
});
