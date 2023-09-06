import { createSelector } from '@ngrx/store';
import { addDays, isAfter, isBefore } from 'date-fns';

import { sharedDataAccessGesuchsFeature } from '@dv/shared/data-access/gesuch';
import { selectSharedDataAccessGesuchsperiodesView } from '@dv/shared/data-access/gesuchsperiode';

export const selectGesuchAppFeatureCockpitView = createSelector(
  selectSharedDataAccessGesuchsperiodesView,
  sharedDataAccessGesuchsFeature.selectGesuchs,
  sharedDataAccessGesuchsFeature.selectLoading,
  (gesuchsPerioden, gesuche, gesucheLoading) => ({
    ...gesuchsPerioden,

    gesuchsperiodes: gesuchsPerioden.gesuchsperiodes
      // TODO where should we put this logic
      .filter((p) =>
        isBefore(
          Date.parse(p.aufschaltdatum ? p.aufschaltdatum : ''),
          new Date()
        )
      )
      .filter((p) => isAfter(Date.parse(p.gueltigBis), addDays(new Date(), 1)))
      .map((p) => ({
        ...p,
        gesuchLoading: gesucheLoading,
        gesuchId: gesuche.find((gesuch) => p.id === gesuch.gesuchsperiode?.id)
          ?.id,
      })),
  })
);
