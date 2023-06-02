import { of } from 'rxjs';

import { loadDeploymentConfig } from './shared-data-access-config.effects';

import { SharedDataAccessConfigService } from './shared-data-access-config.service';
import { SharedDataAccessConfigEvents } from './shared-data-access-config.events';

it('loads actors effect - success', (done) => {
  const sharedDataAccessConfigServiceMock = {
    getDeploymentConfig: () => of({}),
  } as SharedDataAccessConfigService;

  // example of test using real time and done (use TestScheduler instead)
  const actionsMock$ = of(SharedDataAccessConfigEvents.appInit());

  loadDeploymentConfig(
    actionsMock$,
    sharedDataAccessConfigServiceMock
  ).subscribe((action) => {
    expect(action).toEqual(
      SharedDataAccessConfigEvents.deploymentConfigLoadedSuccess({
        deploymentConfig: {},
      })
    );
    done();
  });
});
