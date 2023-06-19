import { selectGesuchAppDataAccessAusbildungstaettesView } from '@dv/gesuch-app/data-access/ausbildungstaette';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { LebenslaufItemDTO } from '@dv/shared/model/gesuch';
import { createSelector } from '@ngrx/store';

export const selectGesuchAppFeatureGesuchFormLebenslaufVew = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectGesuchAppDataAccessAusbildungstaettesView,
  (gesuchsView, ausbildungstaettesView) => ({
    loading: gesuchsView.loading || ausbildungstaettesView.loading,
    gesuch: gesuchsView.gesuch,
    ausbildung: gesuchsView.gesuch?.ausbildungContainer?.ausbildungSB,
    ausbildungstaettes: ausbildungstaettesView.ausbildungstaettes,
    lebenslaufItems: (gesuchsView.gesuch?.lebenslaufItemContainers || [])
      .map((each) => each.lebenslaufItemSB)
      .filter((each) => each?.id) as LebenslaufItemDTO[],
  })
);
