import { createSelector } from '@ngrx/store';

import { Anrede } from '@dv/shared/model/gesuch';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';

export const selectGesuchAppFeatureGesuchFormElternView = createSelector(
  selectGesuchAppDataAccessGesuchsView,
  (gesuchView) => {
    // determine from gesuch  from familien situation
    // extract to utils if used in multiple places
    const isVater = !!gesuchView.gesuch;
    const isMutter = !!gesuchView.gesuch;
    const isVaterPlaceholder =
      isVater &&
      !gesuchView.gesuch?.elternContainers.some(
        (elternContainer) =>
          elternContainer.elternSB?.geschlecht === Anrede.HERR
      );
    const isMutterPlaceholder =
      isMutter &&
      !gesuchView.gesuch?.elternContainers.some(
        (elternContainer) =>
          elternContainer.elternSB?.geschlecht === Anrede.FRAU
      );
    return {
      ...gesuchView,
      elterns:
        gesuchView.gesuch?.elternContainers
          .map((c) => c.elternSB)
          .filter(sharedUtilFnTypeGuardsIsDefined) ?? [],
      isVaterPlaceholder,
      isMutterPlaceholder,
    };
  }
);
