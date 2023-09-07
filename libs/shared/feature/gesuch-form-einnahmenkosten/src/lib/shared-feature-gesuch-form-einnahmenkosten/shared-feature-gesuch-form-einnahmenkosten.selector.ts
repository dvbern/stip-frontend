import { createSelector } from '@ngrx/store';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { selectSharedDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';

export const selectSharedFeatureGesuchFormEinnahmenkostenView = createSelector(
  selectSharedDataAccessGesuchsView,
  selectSharedDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => ({
    loading: gesuchsView.loading,
    gesuch: gesuchsView.gesuch,
    ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
    gesuchFormular: gesuchsView.gesuchFormular,
    einnahmenKosten: gesuchsView.gesuchFormular?.einnahmenKosten,
  })
);
