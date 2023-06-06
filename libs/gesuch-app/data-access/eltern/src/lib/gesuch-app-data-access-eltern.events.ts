import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppDataAccessElternApiEvents = createActionGroup({
  source: 'Eltern API',
  events: {
    // TODO remove dummy
    dummy: emptyProps(),
    // TODO interface should come from a model lib
    elternsLoadedSuccess: props<{ elterns: any[] }>(),
    elternsLoadedFailure: props<{ error: string }>(),
  },
});
