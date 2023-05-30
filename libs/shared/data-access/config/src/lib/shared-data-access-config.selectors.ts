import { createSelector } from '@ngrx/store';
import { sharedDataAccessConfigsFeature } from './shared-data-access-config.feature';

export const selectSharedDataAccessConfigsView = createSelector(
  sharedDataAccessConfigsFeature.selectConfigsState,
  (state) => ({ ...state })
);
