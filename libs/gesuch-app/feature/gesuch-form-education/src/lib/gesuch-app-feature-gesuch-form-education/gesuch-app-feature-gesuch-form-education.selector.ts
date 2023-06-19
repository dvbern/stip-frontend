import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungstaettesView } from '@dv/gesuch-app/data-access/ausbildungstaette';

export const selectGesuchAppFeatureGesuchFormEducationView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungstaettesView,
  (gesuchsView, ausbildungstaettesView) => ({
    loading: gesuchsView.loading || ausbildungstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    ausbildung: gesuchsView.gesuch?.ausbildungContainer?.ausbildungSB,
    ausbildungstaettes: ausbildungstaettesView.ausbildungstaettes,
  })
);
