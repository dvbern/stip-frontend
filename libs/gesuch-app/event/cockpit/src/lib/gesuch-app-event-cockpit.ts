import { createActionGroup, emptyProps } from '@ngrx/store';

export const GesuchAppEventCockpit = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
  },
});
