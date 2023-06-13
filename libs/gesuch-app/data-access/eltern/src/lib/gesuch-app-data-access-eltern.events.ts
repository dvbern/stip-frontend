import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ElternContainerDTO } from '@dv/shared/model/gesuch';

export const GesuchAppDataAccessElternApiEvents = createActionGroup({
  source: 'Eltern API',
  events: {
    elternsLoadedSuccess: props<{ elternContainer: ElternContainerDTO }>(),
    elternsLoadedFailure: props<{ error: string }>(),
  },
});
