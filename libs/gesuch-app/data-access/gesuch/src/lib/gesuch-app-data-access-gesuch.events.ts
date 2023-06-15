import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import { SharedModelError } from '@dv/shared/model/error';

export const GesuchAppDataAccessGesuchEvents = createActionGroup({
  source: 'Gesuch API',
  events: {
    gesuchLoadedSuccess: props<{ gesuch: SharedModelGesuch }>(),
    gesuchLoadedFailure: props<{ error: SharedModelError }>(),
    gesuchCreatedSuccess: props<{ id: string }>(),
    gesuchCreatedFailure: props<{ error: SharedModelError }>(),
    gesuchUpdatedSuccess: props<{
      id: string;
      origin: GesuchAppModelGesuchFormStep;
    }>(),

    gesuchUpdatedFailure: props<{ error: SharedModelError }>(),
    gesuchUpdatedSubformSuccess: props<{
      id: string;
      origin: GesuchAppModelGesuchFormStep;
    }>(),
    gesuchUpdatedSubformFailure: props<{ error: SharedModelError }>(),
    gesuchRemovedSuccess: emptyProps(),
    gesuchRemovedFailure: props<{ error: SharedModelError }>(),
    gesuchsLoadedSuccess: props<{ gesuchs: SharedModelGesuch[] }>(),
    gesuchsLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
