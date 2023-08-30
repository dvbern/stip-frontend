import { of } from 'rxjs';

import { ConfigurationService } from '@dv/shared/model/gesuch';

import { loadDeploymentConfig } from './shared-data-access-config.effects';
import { SharedDataAccessConfigEvents } from './shared-data-access-config.events';

it('loads actors effect - success', (done) => {
  const configurationServiceMock = {
    getDeploymentConfig$: () => of({}),
  } as unknown as ConfigurationService;

  // example of test using real time and done (use TestScheduler instead)
  const actionsMock$ = of(SharedDataAccessConfigEvents.appInit());

  loadDeploymentConfig(actionsMock$, configurationServiceMock).subscribe(
    (action) => {
      expect(action).toEqual(
        SharedDataAccessConfigEvents.deploymentConfigLoadedSuccess({
          deploymentConfig: {},
        })
      );
      done();
    }
  );
});
