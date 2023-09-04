import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';

import { GesuchAppEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { GesuchAppEventGesuchFormEinnahmenkosten } from '@dv/shared/event/gesuch-form-einnahmenkosten';

import { AusbildungsstaetteService } from '@dv/shared/model/gesuch';
import { GesuchAppDataAccessAusbildungsstaetteApiEvents } from './shared-data-access-ausbildungsstaette.events';

export const loadAusbildungsstaettes = createEffect(
  (
    events$ = inject(Actions),
    ausbildungsstaetteService = inject(AusbildungsstaetteService)
  ) => {
    return events$.pipe(
      ofType(
        GesuchAppEventGesuchFormEducation.init,
        GesuchAppEventGesuchFormLebenslauf.init,
        GesuchAppEventGesuchFormEinnahmenkosten.init
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
