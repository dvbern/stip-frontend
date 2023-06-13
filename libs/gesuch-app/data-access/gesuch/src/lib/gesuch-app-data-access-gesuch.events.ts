import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';

export const GesuchAppDataAccessGesuchEvents = createActionGroup({
  source: 'Gesuch API',
  events: {
    gesuchLoadedSuccess: props<{ gesuch: SharedModelGesuch }>(),
    gesuchLoadedFailure: props<{ error: string }>(),
    gesuchCreatedSuccess: props<{ id: string }>(),
    gesuchCreatedFailure: props<{ error: string }>(),
    gesuchUpdatedSuccess: props<{
      id: string;
      origin: GesuchAppModelGesuchFormStep;
    }>(),

    gesuchUpdatedFailure: props<{ error: string }>(),
    gesuchUpdatedSubformSuccess: props<{
      id: string;
    }>(),
    gesuchUpdatedSubformFailure: props<{ error: string }>(),
    gesuchRemovedSuccess: emptyProps(),
    gesuchRemovedFailure: props<{ error: string }>(),
    gesuchsLoadedSuccess: props<{ gesuchs: SharedModelGesuch[] }>(),
    gesuchsLoadedFailure: props<{ error: string }>(),
  },
});
