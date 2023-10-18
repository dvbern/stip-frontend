import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { calculateElternSituationGesuch } from '@dv/shared/util-fn/gesuch-util';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
import { createSelector } from '@ngrx/store';

export const selectSharedFeatureGesuchFormElternView = createSelector(
  selectSharedDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchView, stammdatenView) => {
    const elternSituation = calculateElternSituationGesuch(
      gesuchView.gesuchFormular
    );

    return {
      ...gesuchView,
      elterns: (gesuchView.gesuchFormular?.elterns ?? []).filter(
        sharedUtilFnTypeGuardsIsDefined
      ),
      expectVater: elternSituation.expectVater,
      expectMutter: elternSituation.expectMutter,
      vater: elternSituation.vater,
      mutter: elternSituation.mutter,
      laender: stammdatenView.laender,
    };
  }
);
