import { createSelector } from '@ngrx/store';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { selectSharedDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';

export const selectSharedFeatureGesuchFormEducationView = createSelector(
  selectSharedDataAccessGesuchsView,
  selectSharedDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => ({
    loading: gesuchsView.loading || ausbildungsstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    ausbildung: gesuchsView.gesuchFormular?.ausbildung,
    ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
  })
);
