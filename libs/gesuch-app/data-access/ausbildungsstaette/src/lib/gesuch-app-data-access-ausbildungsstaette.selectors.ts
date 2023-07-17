import { createSelector } from '@ngrx/store';
import { gesuchAppDataAccessAusbildungsstaettesFeature } from './gesuch-app-data-access-ausbildungsstaette.feature';

export const selectGesuchAppDataAccessAusbildungsstaettesView = createSelector(
  gesuchAppDataAccessAusbildungsstaettesFeature.selectAusbildungsstaettesState,
  (state) => ({ ...state })
);
