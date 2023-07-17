import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungsstaettesView } from '@dv/gesuch-app/data-access/ausbildungsstaette';

export const selectGesuchAppFeatureGesuchFormEducationView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => ({
    loading: gesuchsView.loading || ausbildungsstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    ausbildung: gesuchsView.gesuchFormular?.ausbildung,
    ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
  })
);
