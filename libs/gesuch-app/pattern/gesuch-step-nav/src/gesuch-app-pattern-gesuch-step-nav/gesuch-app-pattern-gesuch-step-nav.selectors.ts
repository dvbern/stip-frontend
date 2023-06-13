import { createSelector } from '@ngrx/store';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';

export const gesuchAppPatternGesuchStepNavView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  (gesuch) => ({ ...gesuch })
);
