import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectGesuchAppDataAccessAusbildungsstaettesView } from '@dv/gesuch-app/data-access/ausbildungsstaette';

export const selectGesuchAppFeatureGesuchFormEinnahmenkostenView =
  createSelector(
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
