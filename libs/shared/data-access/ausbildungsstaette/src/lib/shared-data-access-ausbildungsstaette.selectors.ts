import { createSelector } from '@ngrx/store';
import { gesuchAppDataAccessAusbildungsstaettesFeature } from './shared-data-access-ausbildungsstaette.feature';

export const selectSharedDataAccessAusbildungsstaettesView = createSelector(
  gesuchAppDataAccessAusbildungsstaettesFeature.selectAusbildungsstaettesState,
  (state) => ({ ...state })
);
