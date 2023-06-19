import { inject } from '@angular/core';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { GesuchAppDataAccessAusbildungstaetteApiEvents } from './gesuch-app-data-access-ausbildungstaette.events';

import { GesuchAppDataAccessAusbildungstaetteService } from './gesuch-app-data-access-ausbildungstaette.service';

export const loadAusbildungstaettes = createEffect(
  (
    events$ = inject(Actions),
    gesuchAppDataAccessAusbildungstaetteService = inject(
      GesuchAppDataAccessAusbildungstaetteService
    )
  ) => {
    return events$.pipe(
      ofType(
        GesuchAppEventGesuchFormEducation.init,
        GesuchAppEventGesuchFormLebenslauf.init
      ),
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
