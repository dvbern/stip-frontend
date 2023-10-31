import { selectSharedDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { createSelector } from '@ngrx/store';

export const selectSharedFeatureGesuchFormLebenslaufVew = createSelector(
  selectSharedDataAccessGesuchsView,
  selectSharedDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => ({
    loading: gesuchsView.loading || ausbildungsstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    gesuchFormular: gesuchsView.gesuchFormular,
    ausbildung: gesuchsView.gesuchFormular?.ausbildung,
    ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
    lebenslaufItems: (gesuchsView.gesuchFormular?.lebenslaufItems ?? []).filter(
      (each) => each?.id
    ),
    readonly: gesuchsView.readonly,
  })
);
