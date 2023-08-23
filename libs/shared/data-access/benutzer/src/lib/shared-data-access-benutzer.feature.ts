import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { Benutzer } from '@dv/shared/model/gesuch';

import { SharedDataAccessBenutzerApiEvents } from './shared-data-access-benutzer.events';

export interface State {
  currentBenutzer: Benutzer | null;
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  currentBenutzer: null,
  loading: false,
  error: undefined,
};

export const sharedDataAccessBenutzersFeature = createFeature({
  name: 'benutzers',
  reducer: createReducer(
    initialState,

    on(
      SharedDataAccessBenutzerApiEvents.loadCurrentBenutzer,
      (state): State => ({
        ...state,
        currentBenutzer: null,
        loading: true,
        error: undefined,
      })
    ),

    on(
      SharedDataAccessBenutzerApiEvents.currentBenutzerLoadedSuccess,
      (state, { benutzer }): State => ({
        ...state,
        currentBenutzer: benutzer,
        loading: false,
        error: undefined,
      })
    ),
    on(
      SharedDataAccessBenutzerApiEvents.currentBenutzerLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        currentBenutzer: null,
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectBenutzersState,
  selectCurrentBenutzer,
  selectLoading,
  selectError,
} = sharedDataAccessBenutzersFeature;
