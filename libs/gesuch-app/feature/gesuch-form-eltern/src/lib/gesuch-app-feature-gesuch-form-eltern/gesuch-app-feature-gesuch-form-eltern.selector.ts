import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { calculateElternSituationGesuch } from '@dv/gesuch-app/util-fn/gesuch-util';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
import { createSelector } from '@ngrx/store';

export const selectGesuchAppFeatureGesuchFormElternView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchView, stammdatenView) => {
    const elternSituation = calculateElternSituationGesuch(gesuchView.gesuch);

    return {
      ...gesuchView,
      elterns: (gesuchView.gesuch?.elternContainers || [])
        .map((c) => c.elternSB)
        .filter(sharedUtilFnTypeGuardsIsDefined),
      expectVater: elternSituation.expectVater,
      expectMutter: elternSituation.expectMutter,
      vater: elternSituation.vater,
      mutter: elternSituation.mutter,
      laender: stammdatenView.laender,
    };
  }
);
