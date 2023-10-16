import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { GesuchAppDataAccessAbschlussApiEvents } from './gesuch-app-data-access-abschluss.events';

export interface State {
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessAbschlussFeature = createFeature({
  name: 'abschluss',
  reducer: createReducer(
    initialState,
    on(
      GesuchAppDataAccessAbschlussApiEvents.gesuchAbschliessen,
      (state): State => ({
        ...state,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessAbschlussApiEvents.abschlussSuccess,
      (state): State => ({
        ...state,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessAbschlussApiEvents.abschlussFailure,
      (state, { error }): State => ({
        ...state,
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectAbschlussState,
  selectLoading,
  selectError,
} = gesuchAppDataAccessAbschlussFeature;
