import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelDeploymentConfig } from '@dv/shared/model/config';

import { SharedDataAccessConfigActions } from './shared-data-access-config.actions';
import { SharedDataAccessConfigApiActions } from './shared-data-access-config-api.actions';

export interface State {
  deploymentConfig: SharedModelDeploymentConfig | undefined;
  loading: boolean;
  error: string | undefined;
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
      SharedDataAccessConfigActions.appInit,
      (state): State => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),

    on(
      SharedDataAccessConfigApiActions.deploymentConfigLoadedSuccess,
      (state, { deploymentConfig }): State => ({
        ...state,
        deploymentConfig,
        loading: false,
        error: undefined,
      })
    ),
    on(
      SharedDataAccessConfigApiActions.deploymentConfigLoadedFailure,
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
