import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GesuchAppDataAccessElternService } from './gesuch-app-data-access-eltern.service';
import { GesuchAppDataAccessElternApiEvents } from './gesuch-app-data-access-eltern.events';

export const loadElterns = createEffect(
  (
    events$ = inject(Actions),
    gesuchAppDataAccessElternService = inject(GesuchAppDataAccessElternService)
  ) => {
    return events$.pipe(
      // TODO replace with a trigger event (eg some page init)
      ofType(GesuchAppDataAccessElternApiEvents.dummy),
      switchMap(() =>
        gesuchAppDataAccessElternService.getAll().pipe(
          map((elterns) =>
            GesuchAppDataAccessElternApiEvents.elternsLoadedSuccess({ elterns })
          ),
          catchError((error: { message: string }) =>
            of(
              GesuchAppDataAccessElternApiEvents.elternsLoadedFailure({
                error: error.message,
              })
            )
          )
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const gesuchAppDataAccessElternEffects = { loadElterns };
