import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';

import { GesuchAppDataAccessGesuchsperiodeService } from './gesuch-app-data-access-gesuchsperiode.service';
import { GesuchAppDataAccessGesuchsperiodeEvents } from './gesuch-app-data-access-gesuchsperiode.events';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

export const loadGesuchsperiodes = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchsperiodeService = inject(
      GesuchAppDataAccessGesuchsperiodeService
    )
  ) => {
    return actions$.pipe(
      ofType(GesuchAppEventCockpit.init),
      switchMap(() =>
        gesuchAppDataAccessGesuchsperiodeService.getAll().pipe(
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
