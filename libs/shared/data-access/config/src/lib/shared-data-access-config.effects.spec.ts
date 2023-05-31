import { of } from 'rxjs';

import { loadDeploymentConfig } from './shared-data-access-config.effects';

import { SharedDataAccessConfigService } from './shared-data-access-config.service';
import { SharedDataAccessConfigActions } from './shared-data-access-config.actions';
import { SharedDataAccessConfigApiActions } from './shared-data-access-config-api.actions';

it('loads actors effect - success', (done) => {
  const sharedDataAccessConfigServiceMock = {
    getDeploymentConfig: () => of({}),
  } as SharedDataAccessConfigService;

  const actionsMock$ = of(SharedDataAccessConfigActions.appInit());

  loadDeploymentConfig(
    actionsMock$,
    sharedDataAccessConfigServiceMock
  ).subscribe((action) => {
    expect(action).toEqual(
      SharedDataAccessConfigApiActions.deploymentConfigLoadedSuccess({
        deploymentConfig: {},
      })
    );
    done();
  });
});
