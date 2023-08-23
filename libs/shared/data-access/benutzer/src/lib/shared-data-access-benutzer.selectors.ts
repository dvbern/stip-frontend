import { createSelector } from '@ngrx/store';
import { sharedDataAccessBenutzersFeature } from './shared-data-access-benutzer.feature';

export const selectSharedDataAccessBenutzersView = createSelector(
  sharedDataAccessBenutzersFeature.selectBenutzersState,
  (state) => ({ ...state })
);
