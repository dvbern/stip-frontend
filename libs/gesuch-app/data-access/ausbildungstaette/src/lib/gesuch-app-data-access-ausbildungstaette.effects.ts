import { inject } from '@angular/core';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GesuchAppDataAccessAusbildungstaetteService } from './gesuch-app-data-access-ausbildungstaette.service';
import { GesuchAppDataAccessAusbildungstaetteApiEvents } from './gesuch-app-data-access-ausbildungstaette.events';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

export const loadAusbildungstaettes = createEffect(
  (
    events$ = inject(Actions),
    gesuchAppDataAccessAusbildungstaetteService = inject(
      GesuchAppDataAccessAusbildungstaetteService
    )
  ) => {
    return events$.pipe(
      ofType(GesuchAppEventGesuchFormEducation.init),
      switchMap(() =>
        gesuchAppDataAccessAusbildungstaetteService.getAll().pipe(
          map((ausbildungstaettes) =>
            GesuchAppDataAccessAusbildungstaetteApiEvents.ausbildungstaettesLoadedSuccess(
              { ausbildungstaettes }
            )
          ),
          catchError((error) => [
            GesuchAppDataAccessAusbildungstaetteApiEvents.ausbildungstaettesLoadedFailure(
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
export const gesuchAppDataAccessAusbildungstaetteEffects = {
  loadAusbildungstaettes,
};
