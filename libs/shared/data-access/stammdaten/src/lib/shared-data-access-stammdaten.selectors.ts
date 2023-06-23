import { createSelector } from '@ngrx/store';
import { sharedDataAccessStammdatensFeature } from './shared-data-access-stammdaten.feature';

export const selectSharedDataAccessStammdatensView = createSelector(
  sharedDataAccessStammdatensFeature.selectStammdatensState,
  (state) => ({ ...state })
);
