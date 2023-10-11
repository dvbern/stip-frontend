import { createSelector } from '@ngrx/store';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import { selectSharedDataAccessAusbildungsstaettesView } from '@dv/shared/data-access/ausbildungsstaette';

import { format, subMonths } from 'date-fns';

export const selectSharedFeatureGesuchFormEducationView = createSelector(
  selectSharedDataAccessGesuchsView,
  selectSharedDataAccessAusbildungsstaettesView,
  (gesuchsView, ausbildungsstaettesView) => {
    const gesuchsPeriodenStart = gesuchsView.gesuch
      ? new Date(gesuchsView.gesuch.gesuchsperiode.gueltigAb)
      : null;
    return {
      loading: gesuchsView.loading || ausbildungsstaettesView.loading,
      gesuch: gesuchsView.gesuch,
      gesuchFormular: gesuchsView.gesuchFormular,
      ausbildung: gesuchsView.gesuchFormular?.ausbildung,
      ausbildungsstaettes: ausbildungsstaettesView.ausbildungsstaettes,
      gesuchsPeriodenStart: gesuchsPeriodenStart
        ? subMonths(gesuchsPeriodenStart, 1)
        : null,
      gesuchsPeriodenStartFormatted: gesuchsPeriodenStart
        ? format(gesuchsPeriodenStart, 'MM.yyyy')
        : null,
      readonly: gesuchsView.readonly,
    };
  }
);
