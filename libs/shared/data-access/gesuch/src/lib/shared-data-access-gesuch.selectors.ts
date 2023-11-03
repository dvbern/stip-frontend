import { Gesuchstatus } from '@dv/shared/model/gesuch';
import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

import { sharedDataAccessGesuchsFeature } from './shared-data-access-gesuch.feature';

const { selectRouteParam } = getRouterSelectors();

export const selectRouteId = selectRouteParam('id');

export const selectSharedDataAccessGesuchsView = createSelector(
  sharedDataAccessGesuchsFeature.selectGesuchsState,
  (state) => {
    return {
      ...state,
      readonly:
        state.gesuch?.gesuchStatus === Gesuchstatus.NICHT_KOMPLETT_EINGEREICHT,
      trancheId: state.gesuch?.gesuchTrancheToWorkWith.id,
    };
  }
);
