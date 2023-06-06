import { createActionGroup, emptyProps } from '@ngrx/store';

export const GesuchAppEventGesuchFormFamiliensituation = createActionGroup({
  source: 'GesuchFormFamiliensituation Page',
  events: {
    init: emptyProps(),
  },
});
