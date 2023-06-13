import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

import { gesuchAppDataAccessGesuchsFeature } from './gesuch-app-data-access-gesuch.feature';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';

const { selectRouteParam } = getRouterSelectors();

export const selectRouteId = selectRouteParam('id');

export const selectGesuchAppDataAccessGesuchsView = createSelector(
  gesuchAppDataAccessGesuchsFeature.selectGesuchsState,
  (state) => {
    return {
      ...state,
      // TODO resolve which are disabled based on gescuh state
      gesuchFormStepsInfo: Object.entries(GesuchFormSteps).map(
        ([name, config]) => {
          return {
            name,
            ...config,
            disabled: false, // resolve based on gesuch state
          };
        }
      ),
    };
  }
);
