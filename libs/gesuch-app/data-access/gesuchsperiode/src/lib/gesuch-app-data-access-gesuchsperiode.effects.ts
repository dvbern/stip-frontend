import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GesuchAppDataAccessGesuchsperiodeService } from './gesuch-app-data-access-gesuchsperiode.service';
import { GesuchAppDataAccessGesuchsperiodeCockpitActions } from './gesuch-app-data-access-gesuchsperiode.actions';
import { GesuchAppDataAccessGesuchsperiodeApiActions } from './gesuch-app-data-access-gesuchsperiode-api.actions';

export const loadGesuchsperiodes = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchsperiodeService = inject(
      GesuchAppDataAccessGesuchsperiodeService
    )
  ) => {
    return actions$.pipe(
      ofType(GesuchAppDataAccessGesuchsperiodeCockpitActions.init),
      switchMap(() =>
        gesuchAppDataAccessGesuchsperiodeService.getAll().pipe(
          map((gesuchsperiodes) =>
            GesuchAppDataAccessGesuchsperiodeApiActions.gesuchsperiodesLoadedSuccess(
              { gesuchsperiodes }
            )
          ),
          catchError((error: { message: string }) =>
            of(
              GesuchAppDataAccessGesuchsperiodeApiActions.gesuchsperiodesLoadedFailure(
                { error: error.message }
              )
            )
          )
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const gesuchAppDataAccessGesuchsperiodeEffects = { loadGesuchsperiodes };
