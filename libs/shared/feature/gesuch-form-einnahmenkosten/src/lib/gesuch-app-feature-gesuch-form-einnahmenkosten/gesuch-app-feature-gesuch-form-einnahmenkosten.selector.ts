import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';

export const selectSharedFeatureGesuchFormEinnahmenkostenView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => ({
    loading: gesuchsView.loading,
    gesuch: gesuchsView.gesuch,
    ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
    gesuchFormular: gesuchsView.gesuchFormular,
    einnahmenKosten: gesuchsView.gesuchFormular?.einnahmenKosten,
  })
);
