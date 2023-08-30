import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';
import { SharedModelDeploymentConfig } from '@dv/shared/model/config';

import { SharedDataAccessConfigEvents } from './shared-data-access-config.events';

export interface State {
  deploymentConfig: SharedModelDeploymentConfig | undefined;
  loading: boolean;
  error: SharedModelError | undefined;
}

const initialState: State = {
  deploymentConfig: undefined,
  loading: false,
  error: undefined,
};

export const sharedDataAccessConfigsFeature = createFeature({
  name: 'configs',
  reducer: createReducer(
    initialState,
    on(
      SharedDataAccessConfigEvents.appInit,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      SharedDataAccessConfigEvents.deploymentConfigLoadedSuccess,
      (state, { deploymentConfig }): State => ({
        ...state,
        deploymentConfig,
        loading: false,
        error: undefined,
      })
    ),
    on(
      SharedDataAccessConfigEvents.deploymentConfigLoadedFailure,
      // add other failure actions here (if handled the same way)
      (state, { error }): State => ({
        ...state,
        deploymentConfig: undefined,
        loading: false,
        error,
      })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectConfigsState,
  selectDeploymentConfig,
  selectLoading,
  selectError,
} = sharedDataAccessConfigsFeature;
