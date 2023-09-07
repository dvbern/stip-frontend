import { createSelector } from '@ngrx/store';

import { sharedDataAccessGesuchsFeature } from '@dv/shared/data-access/gesuch';

export const selectSachbearbeitungAppFeatureCockpitView = createSelector(
  sharedDataAccessGesuchsFeature.selectGesuchs,
  sharedDataAccessGesuchsFeature.selectLoading,
  (gesuche, gesucheLoading) => ({
    gesuche,
    gesucheLoading,
  })
);
