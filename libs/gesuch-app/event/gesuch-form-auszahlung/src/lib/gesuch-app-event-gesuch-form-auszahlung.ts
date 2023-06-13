import { createActionGroup, emptyProps } from '@ngrx/store';

export const GesuchAppEventGesuchFormAuszahlung = createActionGroup({
  source: 'GesuchFormAuszahlung Page', // TODO rename page to whatever is appropriate
  events: {
    init: emptyProps(),
  },
});
