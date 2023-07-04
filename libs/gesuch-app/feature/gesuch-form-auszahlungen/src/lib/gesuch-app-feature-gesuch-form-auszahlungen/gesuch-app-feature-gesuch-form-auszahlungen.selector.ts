import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import {
  calculateElternSituationGesuch,
  ElternSituation,
} from '@dv/gesuch-app/util-fn/gesuch-util';
import { selectSharedDataAccessStammdatensView } from '@dv/shared/data-access/stammdaten';
import { KontoinhaberinType, SharedModelGesuch } from '@dv/shared/model/gesuch';
import { createSelector } from '@ngrx/store';

export const selectGesuchAppFeatureGesuchFormAuszahlungenView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  selectSharedDataAccessStammdatensView,
  (gesuchsView, stammdatenView) => {
    return {
      loading: gesuchsView.loading || stammdatenView.loading,
      gesuch: gesuchsView.gesuch,
      laender: stammdatenView.laender,
      kontoinhaberValues: calculateKontoinhaberValuesGesuch(gesuchsView.gesuch),
      hasNecessaryPreSteps: calculateHasNecessaryPreStepsGesuch(
        gesuchsView.gesuch
      ),
    };
  }
);

function calculateHasNecessaryPreStepsGesuch(
  gesuch: SharedModelGesuch | undefined
) {
  if (!gesuch?.familiensituationContainer) {
    return false;
  }
  const elternSituation = calculateElternSituationGesuch(gesuch);
  return calculateHasNecessaryPreSteps(elternSituation);
}
export function calculateHasNecessaryPreSteps(
  elternSituation: ElternSituation
) {
  if (elternSituation.expectMutter && !elternSituation.mutter) {
    return false;
  }
  if (elternSituation.expectVater && !elternSituation.vater) {
    return false;
  }
  return true;
}

function calculateKontoinhaberValuesGesuch(
  gesuch: SharedModelGesuch | undefined
) {
  const elternSituation = calculateElternSituationGesuch(gesuch);
  return calculateKontoinhaberValues(elternSituation);
}
export function calculateKontoinhaberValues(elternSituation: ElternSituation) {
  let kontoinhaberValues = Object.values(KontoinhaberinType);

  if (!elternSituation.expectVater) {
    kontoinhaberValues = kontoinhaberValues.filter((each) => each !== 'VATER');
  }
  if (!elternSituation.expectMutter) {
    kontoinhaberValues = kontoinhaberValues.filter((each) => each !== 'MUTTER');
  }
  return kontoinhaberValues;
}
