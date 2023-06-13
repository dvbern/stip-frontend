import { createActionGroup, emptyProps } from '@ngrx/store';

export const GesuchAppEventGesuchFormVater = createActionGroup({
  source: 'GesuchFormEltern Vater Page',
  events: {
    init: emptyProps(),
  },
});

export const GesuchAppEventGesuchFormMutter = createActionGroup({
  source: 'GesuchFormEltern Mutter Page',
  events: {
    init: emptyProps(),
  },
});
