import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

import { gesuchAppDataAccessGesuchsFeature } from './gesuch-app-data-access-gesuch.feature';

const { selectRouteParam } = getRouterSelectors();

export const selectRouteId = selectRouteParam('id');

export const selectGesuchAppDataAccessGesuchsView = createSelector(
  gesuchAppDataAccessGesuchsFeature.selectGesuchsState,
  (state) => ({ ...state })
);
