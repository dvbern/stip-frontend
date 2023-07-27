import { Benutzer } from '@dv/shared/model/gesuch';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventBenutzer = createActionGroup({
  source: 'Benutzer',
  events: {
    init: emptyProps(),
    setBenutzer: props<Benutzer>(),
  },
});
