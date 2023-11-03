import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedEventGesuchFormAbschluss } from '@dv/shared/event/gesuch-form-abschluss';
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
        loading: true,
        error: undefined,
      })
    ),
    on(
      SharedEventGesuchFormAbschluss.init,
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
