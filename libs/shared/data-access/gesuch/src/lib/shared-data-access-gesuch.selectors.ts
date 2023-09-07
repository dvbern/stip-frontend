import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

import { GesuchFormSteps, isStepDisabled } from '@dv/shared/model/gesuch-form';

import { sharedDataAccessGesuchsFeature } from './shared-data-access-gesuch.feature';

const { selectRouteParam } = getRouterSelectors();

export const selectRouteId = selectRouteParam('id');

export const selectSharedDataAccessGesuchsView = createSelector(
  sharedDataAccessGesuchsFeature.selectGesuchsState,
  (state) => {
    return {
      ...state,
      gesuchFormStepsInfo: (
        Object.entries(GesuchFormSteps) as [
          keyof GesuchFormSteps,
          GesuchFormSteps[keyof GesuchFormSteps]
        ][]
      ).map(([name, step]) => ({
        name,
        ...step,
        disabled: isStepDisabled(name, state.gesuchFormular),
      })),
    };
  }
);