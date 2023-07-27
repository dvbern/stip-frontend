import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

import { SharedDataAccessStammdatenApiEvents } from './shared-data-access-stammdaten.events';
import { Land } from '@dv/shared/model/gesuch';

export interface State {
  laender: Land[];
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  laender: [],
  loading: false,
  error: undefined,
};

export const sharedDataAccessStammdatensFeature = createFeature({
  name: 'stammdatens',
  reducer: createReducer(
    initialState,

    on(
      SharedDataAccessStammdatenApiEvents.init,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      SharedDataAccessStammdatenApiEvents.stammdatensLoadedSuccess,
      (state, { laender }): State => ({
        ...state,
        laender,
        loading: false,
        error: undefined,
      })
    ),
    on(
      SharedDataAccessStammdatenApiEvents.stammdatensLoadedFailure,
      // add other failure events here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        laender: [],
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name,
  reducer,
  selectStammdatensState,
  selectLaender,
  selectLoading,
  selectError,
} = sharedDataAccessStammdatensFeature;
