import { createSelector } from '@ngrx/store';
import { gesuchAppDataAccessElternsFeature } from './gesuch-app-data-access-eltern.feature';

export const selectGesuchAppDataAccessElternsView = createSelector(
  gesuchAppDataAccessElternsFeature.selectElternsState,
  (state) => ({ ...state })
);
