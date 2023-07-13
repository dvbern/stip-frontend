import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungstaettesView } from '@dv/gesuch-app/data-access/ausbildungstaette';

export const selectGesuchAppFeatureGesuchFormEducationView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungstaettesView,
  (gesuchsView, ausbildungstaettesView) => ({
    loading: gesuchsView.loading || ausbildungstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    ausbildung: gesuchsView.gesuchFormular?.ausbildung,
    ausbildungstaettes: ausbildungstaettesView.ausbildungstaettes,
  })
);
