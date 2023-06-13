import { createActionGroup, emptyProps } from '@ngrx/store';

export const GesuchAppEventGesuchFormEltern = createActionGroup({
  source: 'GesuchFormEltern Eltern Page',
  events: {
    init: emptyProps(),
  },
});

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
