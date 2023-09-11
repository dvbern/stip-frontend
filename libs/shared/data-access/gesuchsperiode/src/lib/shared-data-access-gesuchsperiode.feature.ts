import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { Gesuchsperiode } from '@dv/shared/model/gesuch';

import { sharedDataAccessGesuchsperiodeEvents } from './shared-data-access-gesuchsperiode.events';

export interface State {
  gesuchsperiodes: Gesuchsperiode[];
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  gesuchsperiodes: [],
  loading: false,
  error: undefined,
};

export const sharedDataAccessGesuchsperiodesFeature = createFeature({
  name: 'gesuchsperiodes',
  reducer: createReducer(
    initialState,
    on(
      sharedDataAccessGesuchsperiodeEvents.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      sharedDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedSuccess,
      (state, { gesuchsperiodes }): State => ({
        ...state,
        gesuchsperiodes,
        loading: false,
        error: undefined,
      })
    ),
    on(
      sharedDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedFailure,
      // add other failure actions here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        gesuchsperiodes: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectGesuchsperiodesState,
  selectGesuchsperiodes,
  selectLoading,
  selectError,
} = sharedDataAccessGesuchsperiodesFeature;
