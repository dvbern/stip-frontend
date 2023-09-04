import { createSelector } from '@ngrx/store';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';

export const gesuchAppPatternGesuchStepNavView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  (gesuch) => ({ ...gesuch })
);
