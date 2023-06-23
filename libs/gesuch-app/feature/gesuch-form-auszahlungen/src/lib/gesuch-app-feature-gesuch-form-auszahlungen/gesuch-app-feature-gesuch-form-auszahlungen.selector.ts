import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';

export const selectGesuchAppFeatureGesuchFormAuszahlungenView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchsView, stammdatenView) => ({
    loading: gesuchsView.loading || stammdatenView.loading,
    gesuch: gesuchsView.gesuch,
    laender: stammdatenView.laender,
  })
);
