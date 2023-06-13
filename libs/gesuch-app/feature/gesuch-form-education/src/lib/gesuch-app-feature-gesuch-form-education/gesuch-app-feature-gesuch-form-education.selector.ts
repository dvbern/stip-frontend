import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungsgangsView } from '@dv/gesuch-app/data-access/ausbildungsgang';

export const selectGesuchAppFeatureGesuchFormEducationView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungsgangsView,
  (gesuchsView, ausbildungsgangsView) => ({
    loading: gesuchsView.loading || ausbildungsgangsView.loading,
    gesuch: gesuchsView.gesuch,
    ausbildung: gesuchsView.gesuch?.ausbildung.ausbildungSB,
    ausbildungsgangLands: ausbildungsgangsView.ausbildungsgangLands,
  })
);
