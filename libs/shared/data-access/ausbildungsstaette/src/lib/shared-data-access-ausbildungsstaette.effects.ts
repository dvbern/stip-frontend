import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';

import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { SharedEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { SharedEventGesuchFormEinnahmenkosten } from '@dv/shared/event/gesuch-form-einnahmenkosten';
import { AusbildungsstaetteService } from '@dv/shared/model/gesuch';

import { SharedDataAccessAusbildungsstaetteApiEvents } from './shared-data-access-ausbildungsstaette.events';

export const loadAusbildungsstaettes = createEffect(
  (
    events$ = inject(Actions),
    ausbildungsstaetteService = inject(AusbildungsstaetteService)
  ) => {
    return events$.pipe(
      ofType(
        SharedEventGesuchFormEducation.init,
        SharedEventGesuchFormLebenslauf.init,
        SharedEventGesuchFormEinnahmenkosten.init
      ),
      switchMap(() =>
        ausbildungsstaetteService.getAusbildungsstaetten$().pipe(
          map((ausbildungsstaettes) =>
            SharedDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess(
              { ausbildungsstaettes }
            )
          ),
          catchError((error) => [
            SharedDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedFailure(
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
