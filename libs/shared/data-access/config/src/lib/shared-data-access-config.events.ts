import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelDeploymentConfig } from '@dv/shared/model/config';

export const SharedDataAccessConfigEvents = createActionGroup({
  source: 'Config API',
  events: {
    appInit: emptyProps(),
    deploymentConfigLoadedSuccess: props<{
      deploymentConfig: SharedModelDeploymentConfig;
    }>(),
    deploymentConfigLoadedFailure: props<{ error: string }>(),
  },
});
