import { selectGesuchAppDataAccessAusbildungstaettesView } from '@dv/gesuch-app/data-access/ausbildungstaette';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { createSelector } from '@ngrx/store';

export const selectGesuchAppFeatureGesuchFormLebenslaufVew = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungstaettesView,
  (gesuchsView, ausbildungstaettesView) => ({
    loading: gesuchsView.loading || ausbildungstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    ausbildung: gesuchsView.gesuchFormular?.ausbildung,
    ausbildungstaettes: ausbildungstaettesView.ausbildungstaettes,
    lebenslaufItems: (gesuchsView.gesuchFormular?.lebenslaufItems ?? []).filter(
      (each) => each?.id
    ),
  })
);
