import { inject } from '@angular/core';
import { catchError, switchMap, map } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { BenutzerService } from '@dv/shared/model/gesuch';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

import { SharedDataAccessBenutzerApiEvents } from './shared-data-access-benutzer.events';

export const loadCurrentBenutzer = createEffect(
  (events$ = inject(Actions), benutzerService = inject(BenutzerService)) => {
    return events$.pipe(
      ofType(SharedDataAccessBenutzerApiEvents.loadCurrentBenutzer),
      switchMap(() =>
        benutzerService.getCurrentBenutzer$().pipe(
          map((benutzer) =>
            SharedDataAccessBenutzerApiEvents.currentBenutzerLoadedSuccess({
              benutzer,
            })
          ),
          catchError((error) => [
            SharedDataAccessBenutzerApiEvents.currentBenutzerLoadedFailure({
              error: sharedUtilFnErrorTransformer(error),
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const sharedDataAccessBenutzerEffects = { loadCurrentBenutzer };
