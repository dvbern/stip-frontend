import { createSelector } from '@ngrx/store';
import { gesuchAppDataAccessAusbildungsgangsFeature } from './gesuch-app-data-access-ausbildungsgang.feature';

export const selectGesuchAppDataAccessAusbildungsgangsView = createSelector(
  gesuchAppDataAccessAusbildungsgangsFeature.selectAusbildungsgangsState,
  (state) => ({ ...state })
);
