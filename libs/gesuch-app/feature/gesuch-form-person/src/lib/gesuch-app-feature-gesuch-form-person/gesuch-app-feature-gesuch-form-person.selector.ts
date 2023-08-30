import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';

export const selectGesuchAppFeatureGesuchFormEducationView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchsView, stammdatenView) => ({
    loading: gesuchsView.loading || stammdatenView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    laender: stammdatenView.laender,
  })
);
