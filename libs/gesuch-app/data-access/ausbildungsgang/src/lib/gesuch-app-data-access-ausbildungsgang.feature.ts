import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { AusbildungsgangLand } from '@dv/shared/model/gesuch';
import { createFeature, createReducer, on } from '@ngrx/store';

import { GesuchAppDataAccessAusbildungsgangApiEvents } from './gesuch-app-data-access-ausbildungsgang.events';

export interface State {
  ausbildungsgangLands: AusbildungsgangLand[];
  loading: boolean;
  error: string | undefined;
}

const initialState: State = {
  ausbildungsgangLands: [],
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessAusbildungsgangsFeature = createFeature({
  name: 'ausbildungsgangs',
  reducer: createReducer(
    initialState,

    on(
      GesuchAppEventGesuchFormEducation.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessAusbildungsgangApiEvents.ausbildungsgangsLoadedSuccess,
      (state, { ausbildungsgangLands }): State => ({
        ...state,
        ausbildungsgangLands: ausbildungsgangLands,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessAusbildungsgangApiEvents.ausbildungsgangsLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        ausbildungsgangLands: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectAusbildungsgangsState,
  selectAusbildungsgangLands,
  selectLoading,
  selectError,
} = gesuchAppDataAccessAusbildungsgangsFeature;
