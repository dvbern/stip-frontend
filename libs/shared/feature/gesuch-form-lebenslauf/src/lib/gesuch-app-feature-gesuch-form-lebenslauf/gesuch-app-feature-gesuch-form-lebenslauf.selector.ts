import { selectGesuchAppDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { createSelector } from '@ngrx/store';

export const selectSharedFeatureGesuchFormLebenslaufVew = createSelector(
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
