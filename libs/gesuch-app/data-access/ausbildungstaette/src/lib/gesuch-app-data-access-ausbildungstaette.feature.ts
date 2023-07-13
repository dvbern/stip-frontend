import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';

import { GesuchAppDataAccessAusbildungstaetteApiEvents } from './gesuch-app-data-access-ausbildungstaette.events';
import { Ausbildungsstaette } from '@dv/shared/model/gesuch';

export interface State {
  ausbildungstaettes: Ausbildungsstaette[];
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  ausbildungstaettes: [],
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessAusbildungstaettesFeature = createFeature({
  name: 'ausbildungstaettes',
  reducer: createReducer(
    initialState,

    on(
      GesuchAppEventGesuchFormEducation.init,
      GesuchAppEventGesuchFormLebenslauf.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessAusbildungstaetteApiEvents.ausbildungstaettesLoadedSuccess,
      (state, { ausbildungstaettes }): State => ({
        ...state,
        ausbildungstaettes: ausbildungstaettes,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessAusbildungstaetteApiEvents.ausbildungstaettesLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        ausbildungstaettes: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectAusbildungstaettesState,
  selectAusbildungstaettes,
  selectLoading,
  selectError,
} = gesuchAppDataAccessAusbildungstaettesFeature;
