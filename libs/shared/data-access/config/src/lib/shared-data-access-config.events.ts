import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SharedModelDeploymentConfig } from '@dv/shared/model/config';
import { SharedModelError } from '@dv/shared/model/error';

export const SharedDataAccessConfigEvents = createActionGroup({
  source: 'Config API',
  events: {
    appInit: emptyProps(),
    deploymentConfigLoadedSuccess: props<{
      deploymentConfig: SharedModelDeploymentConfig;
    }>(),
    deploymentConfigLoadedFailure: props<{ error: SharedModelError }>(),
  },
});
