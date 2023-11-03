import { createSelector } from '@ngrx/store';

import { toAbschlussPhase } from '@dv/gesuch-app/model/gesuch-abschluss';
import { sharedDataAccessGesuchsFeature } from '@dv/shared/data-access/gesuch';

import { gesuchAppDataAccessAbschlussFeature } from './gesuch-app-data-access-abschluss.feature';

export const selectGesuchAppDataAccessAbschlusssView = createSelector(
  gesuchAppDataAccessAbschlussFeature.selectAbschlussState,
  sharedDataAccessGesuchsFeature.selectGesuch,
  // TODO: calculate or fetch isValid for toAbschlussPhase
  (state, gesuch) => ({
    ...state,
    gesuch,
    abschlussPhase: toAbschlussPhase(gesuch, true),
  })
);
