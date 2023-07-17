import { inject } from '@angular/core';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { GesuchAppDataAccessAusbildungsstaetteApiEvents } from './gesuch-app-data-access-ausbildungsstaette.events';

import { GesuchAppDataAccessAusbildungsstaetteService } from './gesuch-app-data-access-ausbildungsstaette.service';

export const loadAusbildungsstaettes = createEffect(
  (
    events$ = inject(Actions),
    gesuchAppDataAccessAusbildungsstaetteService = inject(
      GesuchAppDataAccessAusbildungsstaetteService
    )
  ) => {
    return events$.pipe(
      ofType(
        GesuchAppEventGesuchFormEducation.init,
        GesuchAppEventGesuchFormLebenslauf.init
      ),
      switchMap(() =>
        gesuchAppDataAccessAusbildungsstaetteService.getAll().pipe(
          map((ausbildungsstaettes) =>
            GesuchAppDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess(
              { ausbildungsstaettes }
            )
          ),
          catchError((error) => [
            GesuchAppDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedFailure(
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
export const gesuchAppDataAccessAusbildungsstaetteEffects = {
  loadAusbildungsstaettes,
};
