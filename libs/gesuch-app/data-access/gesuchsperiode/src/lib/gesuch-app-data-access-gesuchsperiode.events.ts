import { createActionGroup, props } from '@ngrx/store';

export const GesuchAppDataAccessGesuchsperiodeEvents = createActionGroup({
  source: 'Gesuchsperiode API',
  events: {
    // TODO interface should come from a model lib
    gesuchsperiodesLoadedSuccess: props<{ gesuchsperiodes: any[] }>(),
    gesuchsperiodesLoadedFailure: props<{ error: string }>(),
  },
});
