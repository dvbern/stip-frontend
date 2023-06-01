import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppDataAccessGesuchEvents = createActionGroup({
  source: 'Gesuch API',
  events: {
    gesuchLoadedSuccess: props<{ gesuch: SharedModelGesuch }>(),
    gesuchLoadedFailure: props<{ error: string }>(),
    gesuchCreatedSuccess: props<{ id: string; target: string }>(),
    gesuchCreatedFailure: props<{ error: string }>(),
    gesuchUpdatedSuccess: props<{ id: string; target: string }>(),
    gesuchUpdatedFailure: props<{ error: string }>(),
    gesuchRemovedSuccess: emptyProps(),
    gesuchRemovedFailure: props<{ error: string }>(),
    gesuchsLoadedSuccess: props<{ gesuchs: SharedModelGesuch[] }>(),
    gesuchsLoadedFailure: props<{ error: string }>(),
  },
});
