import { computed } from '@angular/core';
import {
  calculateElternSituation,
  calculateElternSituationGesuch,
} from '@dv/gesuch-app/util-fn/gesuch-util';
import { KontoinhaberinType, SharedModelGesuch } from '@dv/shared/model/gesuch';
import { createSelector } from '@ngrx/store';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';

export const selectGesuchAppFeatureGesuchFormAuszahlungenView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchsView, stammdatenView) => {
    return {
      loading: gesuchsView.loading || stammdatenView.loading,
      gesuch: gesuchsView.gesuch,
      laender: stammdatenView.laender,
      kontoinhaberValues: calculateKontoinhaberValues(gesuchsView.gesuch),
      hasNecessaryPreSteps: calculateHasNecessaryPreSteps(gesuchsView.gesuch),
    };
  }
);

function calculateHasNecessaryPreSteps(gesuch: SharedModelGesuch | undefined) {
  if (!gesuch?.familiensituationContainer) {
    return false;
  }
  const elternSituation = calculateElternSituationGesuch(gesuch);
  if (elternSituation.expectMutter && !elternSituation.mutter) {
    return false;
  }
  if (elternSituation.expectVater && !elternSituation.vater) {
    return false;
  }
  return true;
}

function calculateKontoinhaberValues(gesuch: SharedModelGesuch | undefined) {
  let kontoinhaberValues = Object.values(KontoinhaberinType);

  if (gesuch) {
    const elternSituation = calculateElternSituationGesuch(gesuch);
    if (!elternSituation.expectVater) {
      kontoinhaberValues = kontoinhaberValues.filter(
        (each) => each !== 'VATER'
      );
    }
    if (!elternSituation.expectMutter) {
      kontoinhaberValues = kontoinhaberValues.filter(
        (each) => each !== 'MUTTER'
      );
    }
  }
  return kontoinhaberValues;
}
