import { Wohnsitz } from '@dv/shared/model/gesuch';
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
    wohnsitzNotEigenerHaushalt:
      gesuchsView.gesuchFormular?.personInAusbildung?.wohnsitz !==
      Wohnsitz.EIGENER_HAUSHALT,
    existiertGerichtlicheAlimentenregelung:
      gesuchsView.gesuchFormular?.familiensituation
        ?.gerichtlicheAlimentenregelung === true,
    readonly: gesuchsView.readonly,
  })
);
