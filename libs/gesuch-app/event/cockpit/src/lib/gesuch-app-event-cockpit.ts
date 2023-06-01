import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventCockpit = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
    newTriggered: emptyProps(),
    removeTriggered: props<{ id: string }>(),
  },
});
