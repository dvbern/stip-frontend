import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventCockpit = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
    newTriggered: props<{
      periodeId: string;
    }>(),
    removeTriggered: props<{ id: string }>(),
  },
});
