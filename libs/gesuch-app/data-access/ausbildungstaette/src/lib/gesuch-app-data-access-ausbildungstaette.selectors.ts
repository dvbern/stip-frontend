import { createSelector } from '@ngrx/store';
import { gesuchAppDataAccessAusbildungstaettesFeature } from './gesuch-app-data-access-ausbildungstaette.feature';

export const selectGesuchAppDataAccessAusbildungstaettesView = createSelector(
  gesuchAppDataAccessAusbildungstaettesFeature.selectAusbildungstaettesState,
  (state) => ({ ...state })
);
