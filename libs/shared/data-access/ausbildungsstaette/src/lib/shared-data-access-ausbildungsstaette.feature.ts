import { SharedEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';

import { SharedDataAccessAusbildungsstaetteApiEvents } from './shared-data-access-ausbildungsstaette.events';
import { Ausbildungsstaette } from '@dv/shared/model/gesuch';

export interface State {
  ausbildungsstaettes: Ausbildungsstaette[];
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  ausbildungsstaettes: [],
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessAusbildungsstaettesFeature = createFeature({
  name: 'ausbildungsstaettes',
  reducer: createReducer(
    initialState,

    on(
      SharedEventGesuchFormEducation.init,
      SharedEventGesuchFormLebenslauf.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      SharedDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess,
      (state, { ausbildungsstaettes }): State => ({
        ...state,
        ausbildungsstaettes: ausbildungsstaettes,
        loading: false,
        error: undefined,
      })
    ),
    on(
      SharedDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        ausbildungsstaettes: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectAusbildungsstaettesState,
  selectAusbildungsstaettes,
  selectLoading,
  selectError,
} = gesuchAppDataAccessAusbildungsstaettesFeature;
