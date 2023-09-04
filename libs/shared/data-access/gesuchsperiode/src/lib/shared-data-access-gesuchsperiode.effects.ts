import { inject } from '@angular/core';
import { catchError, switchMap, map } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GesuchsperiodeService } from '@dv/shared/model/gesuch';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

import { GesuchAppDataAccessGesuchsperiodeEvents } from './shared-data-access-gesuchsperiode.events';

export const loadGesuchsperiodes = createEffect(
  (
    actions$ = inject(Actions),
    gesuchsperiodeService = inject(GesuchsperiodeService)
  ) => {
    return actions$.pipe(
      ofType(GesuchAppDataAccessGesuchsperiodeEvents.init),
      switchMap(() =>
        gesuchsperiodeService.getGesuchsperioden$().pipe(
          map((gesuchsperiodes) =>
            GesuchAppDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedSuccess(
              { gesuchsperiodes }
            )
          ),
          catchError((error) => [
            GesuchAppDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedFailure(
              { error: sharedUtilFnErrorTransformer(error) }
            ),
          ])
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const gesuchAppDataAccessGesuchsperiodeEffects = { loadGesuchsperiodes };
