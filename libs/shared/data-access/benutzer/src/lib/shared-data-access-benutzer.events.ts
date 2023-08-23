import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Benutzer } from '@dv/shared/model/gesuch';
import { SharedModelError } from '@dv/shared/model/error';

export const SharedDataAccessBenutzerApiEvents = createActionGroup({
  source: 'Benutzer API',
  events: {
    loadCurrentBenutzer: emptyProps(),
    currentBenutzerLoadedSuccess: props<{ benutzer: Benutzer }>(),
    currentBenutzerLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
