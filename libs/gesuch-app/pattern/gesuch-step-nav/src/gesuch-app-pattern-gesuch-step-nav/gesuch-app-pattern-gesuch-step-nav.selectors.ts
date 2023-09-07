import { createSelector } from '@ngrx/store';

import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';

export const gesuchAppPatternGesuchStepNavView = createSelector(
  selectSharedDataAccessGesuchsView,
  (gesuch) => ({ ...gesuch })
);
