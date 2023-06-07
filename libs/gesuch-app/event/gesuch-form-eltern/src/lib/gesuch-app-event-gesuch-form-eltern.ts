import { createActionGroup, emptyProps } from '@ngrx/store';

export const GesuchAppEventGesuchFormEltern = createActionGroup({
  source: 'GesuchFormEltern Page',
  events: {
    init: emptyProps(),
  },
});
