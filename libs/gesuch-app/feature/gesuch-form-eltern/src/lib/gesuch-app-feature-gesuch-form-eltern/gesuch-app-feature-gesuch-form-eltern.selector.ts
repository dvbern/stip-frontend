import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { calculateElternSituation } from '@dv/gesuch-app/util-fn/gesuch-util';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
import { createSelector } from '@ngrx/store';

export const selectGesuchAppFeatureGesuchFormElternView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchView, stammdatenView) => {
    // determine from gesuch  from familien situation
    // extract to utils if used in multiple places
    const familienSituation =
      gesuchView.gesuch?.familiensituationContainer?.familiensituationSB;
    const elternSituation = calculateElternSituation(
      familienSituation,
      gesuchView.gesuch?.elternContainers
    );

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
