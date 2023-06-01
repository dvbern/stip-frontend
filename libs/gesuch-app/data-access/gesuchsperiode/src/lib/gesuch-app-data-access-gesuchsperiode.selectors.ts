import { createSelector } from '@ngrx/store';
import { gesuchAppDataAccessGesuchsperiodesFeature } from './gesuch-app-data-access-gesuchsperiode.feature';

export const selectGesuchAppDataAccessGesuchsperiodesView = createSelector(
  gesuchAppDataAccessGesuchsperiodesFeature.selectGesuchsperiodesState,
  (state) => ({ ...state })
);
