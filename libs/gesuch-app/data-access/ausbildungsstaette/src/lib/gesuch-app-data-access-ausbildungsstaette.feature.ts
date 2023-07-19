import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';

import { GesuchAppDataAccessAusbildungsstaetteApiEvents } from './gesuch-app-data-access-ausbildungsstaette.events';
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
      GesuchAppEventGesuchFormEducation.init,
      GesuchAppEventGesuchFormLebenslauf.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess,
      (state, { ausbildungsstaettes }): State => ({
        ...state,
        ausbildungsstaettes: ausbildungsstaettes,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedFailure,
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
