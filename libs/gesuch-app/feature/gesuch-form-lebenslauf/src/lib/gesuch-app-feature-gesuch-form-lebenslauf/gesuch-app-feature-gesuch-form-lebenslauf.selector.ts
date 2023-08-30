import { selectGesuchAppDataAccessAusbildungsstaettesView } from '@dv/gesuch-app/data-access/ausbildungsstaette';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { createSelector } from '@ngrx/store';

export const selectGesuchAppFeatureGesuchFormLebenslaufVew = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => ({
    loading: gesuchsView.loading || ausbildungsstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    ausbildung: gesuchsView.gesuchFormular?.ausbildung,
    ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
    lebenslaufItems: (gesuchsView.gesuchFormular?.lebenslaufItems ?? []).filter(
      (each) => each?.id
    ),
  })
);
