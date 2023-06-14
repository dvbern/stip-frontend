import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppEventCockpit = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
    newTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
    }>(),
    removeTriggered: props<{ id: string }>(),
  },
});
