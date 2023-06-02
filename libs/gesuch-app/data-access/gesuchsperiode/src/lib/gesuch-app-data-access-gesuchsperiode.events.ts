import {GesuchsperiodeDTO} from '@dv/shared/model/gesuch';
import { createActionGroup, props } from '@ngrx/store';

export const GesuchAppDataAccessGesuchsperiodeEvents = createActionGroup({
  source: 'Gesuchsperiode API',
  events: {
    gesuchsperiodesLoadedSuccess: props<{ gesuchsperiodes: GesuchsperiodeDTO[] }>(),
    gesuchsperiodesLoadedFailure: props<{ error: string }>(),
  },
});
