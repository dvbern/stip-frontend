import { gesuchAppDataAccessGesuchsFeature } from '@dv/gesuch-app/data-access/gesuch';

import { selectGesuchAppDataAccessGesuchsperiodesView } from '@dv/gesuch-app/data-access/gesuchsperiode';
import { createSelector } from '@ngrx/store';
import { addDays, isAfter, isBefore } from 'date-fns';

export const selectGesuchAppFeatureCockpitView = createSelector(
  selectGesuchAppDataAccessGesuchsperiodesView,
  gesuchAppDataAccessGesuchsFeature.selectGesuchs,
  gesuchAppDataAccessGesuchsFeature.selectLoading,
  (gesuchsPerioden, gesuche, gesucheLoading) => ({
    ...gesuchsPerioden,

    gesuchsperiodes: gesuchsPerioden.gesuchsperiodes
      // TODO where should we put this logic
      .filter((p) => isBefore(Date.parse(p.aufschaltdatum), new Date()))
      .filter((p) => isAfter(Date.parse(p.gueltigBis), addDays(new Date(), 1)))
      .map((p) => ({
        ...p,
        gesuchLoading: gesucheLoading,
        gesuchId: gesuche.find((gesuch) => p.id === gesuch.gesuchsperiode?.id)
          ?.id,
      })),
  })
);
