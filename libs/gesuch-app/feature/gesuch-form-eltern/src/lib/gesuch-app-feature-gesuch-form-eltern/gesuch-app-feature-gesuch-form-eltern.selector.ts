import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';

const { selectRouteDataParam } = getRouterSelectors();

export const selectGesuchAppFeatureGesuchFormElternView = createSelector(
  selectRouteDataParam('type'),
  selectGesuchAppDataAccessGesuchsView,
  (type, gesuchView) => {
    return { type, ...gesuchView };
  }
);
