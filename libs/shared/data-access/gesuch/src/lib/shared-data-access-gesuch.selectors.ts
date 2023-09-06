import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

import { GesuchFormSteps } from '@dv/shared/model/gesuch-form';

import { sharedDataAccessGesuchsFeature } from './shared-data-access-gesuch.feature';

const { selectRouteParam } = getRouterSelectors();

export const selectRouteId = selectRouteParam('id');

export const selectSharedDataAccessGesuchsView = createSelector(
  sharedDataAccessGesuchsFeature.selectGesuchsState,
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
