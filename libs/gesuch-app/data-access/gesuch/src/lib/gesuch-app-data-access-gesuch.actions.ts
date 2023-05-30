import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppDataAccessGesuchCockpitActions = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
    newTriggered: emptyProps(),
    removeTriggered: props<{ id: string }>(),
  },
});

export const GesuchAppDataAccessGesuchFormActions = createActionGroup({
  source: 'Gesuch Form Page',
  events: {
    init: emptyProps(),
    prevStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      target: string;
    }>(),
    nextStepTriggered: props<{
      gesuch: Partial<SharedModelGesuch>;
      target: string;
    }>(),
  },
});
