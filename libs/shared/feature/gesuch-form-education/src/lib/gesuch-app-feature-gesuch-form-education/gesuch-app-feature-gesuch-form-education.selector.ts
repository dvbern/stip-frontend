import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';

export const selectSharedFeatureGesuchFormEducationView = createSelector(
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
