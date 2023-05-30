import { createActionGroup, props } from '@ngrx/store';

import { SharedModelDeploymentConfig } from '@dv/shared/model/config';

export const SharedDataAccessConfigApiActions = createActionGroup({
  source: 'Config API',
  events: {
    deploymentConfigLoadedSuccess: props<{
      deploymentConfig: SharedModelDeploymentConfig;
    }>(),
    deploymentConfigLoadedFailure: props<{ error: string }>(),
  },
});
