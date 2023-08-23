import { inject } from '@angular/core';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { AusbildungsstaetteService } from '@dv/shared/model/gesuch';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { GesuchAppDataAccessAusbildungsstaetteApiEvents } from './gesuch-app-data-access-ausbildungsstaette.events';

export const loadAusbildungsstaettes = createEffect(
  (
    events$ = inject(Actions),
    ausbildungsstaetteService = inject(AusbildungsstaetteService)
  ) => {
    return events$.pipe(
      ofType(
        GesuchAppEventGesuchFormEducation.init,
        GesuchAppEventGesuchFormLebenslauf.init
      ),
      switchMap(() =>
        ausbildungsstaetteService.getAusbildungsstaetten$().pipe(
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
