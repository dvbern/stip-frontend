import { inject } from '@angular/core';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GesuchAppDataAccessAusbildungsgangService } from './gesuch-app-data-access-ausbildungsgang.service';
import { GesuchAppDataAccessAusbildungsgangApiEvents } from './gesuch-app-data-access-ausbildungsgang.events';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

export const loadAusbildungsgangs = createEffect(
  (
    events$ = inject(Actions),
    gesuchAppDataAccessAusbildungsgangService = inject(
      GesuchAppDataAccessAusbildungsgangService
    )
  ) => {
    return events$.pipe(
      ofType(GesuchAppEventGesuchFormEducation.init),
      switchMap(() =>
        gesuchAppDataAccessAusbildungsgangService.getAll().pipe(
          map((ausbildungsgangLands) =>
            GesuchAppDataAccessAusbildungsgangApiEvents.ausbildungsgangsLoadedSuccess(
              { ausbildungsgangLands }
            )
          ),
          catchError((error) => [
            GesuchAppDataAccessAusbildungsgangApiEvents.ausbildungsgangsLoadedFailure(
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
export const gesuchAppDataAccessAusbildungsgangEffects = {
  loadAusbildungsgangs,
};
