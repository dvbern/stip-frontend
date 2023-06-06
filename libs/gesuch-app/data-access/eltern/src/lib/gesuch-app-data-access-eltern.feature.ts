import { createFeature, createReducer, on } from '@ngrx/store';

import { GesuchAppDataAccessElternApiEvents } from './gesuch-app-data-access-eltern.events';

export interface State {
  // TODO interface should come from a model lib
  elterns: any[];
  loading: boolean;
  error: string | undefined;
}

const initialState: State = {
  elterns: [],
  loading: false,
  error: undefined,
};

export const gesuchAppDataAccessElternsFeature = createFeature({
  name: 'elterns',
  reducer: createReducer(
    initialState,

    // TODO replace with a trigger event (eg some page init)
    on(
      GesuchAppDataAccessElternApiEvents.dummy,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      GesuchAppDataAccessElternApiEvents.elternsLoadedSuccess,
      (state, { elterns }): State => ({
        ...state,
        elterns,
        loading: false,
        error: undefined,
      })
    ),
    on(
      GesuchAppDataAccessElternApiEvents.elternsLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        elterns: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectElternsState,
  selectElterns,
  selectLoading,
  selectError,
} = gesuchAppDataAccessElternsFeature;
