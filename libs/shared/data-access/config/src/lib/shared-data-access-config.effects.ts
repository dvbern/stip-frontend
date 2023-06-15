import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

import { SharedDataAccessConfigService } from './shared-data-access-config.service';
import { SharedDataAccessConfigEvents } from './shared-data-access-config.events';

export const loadDeploymentConfig = createEffect(
  (
    actions$ = inject(Actions),
    sharedDataAccessConfigService = inject(SharedDataAccessConfigService)
  ) => {
    return actions$.pipe(
      ofType(SharedDataAccessConfigEvents.appInit),
      switchMap(() =>
        sharedDataAccessConfigService.getDeploymentConfig().pipe(
          map((deploymentConfig) =>
            SharedDataAccessConfigEvents.deploymentConfigLoadedSuccess({
              deploymentConfig,
            })
          ),
          catchError((error) => [
            SharedDataAccessConfigEvents.deploymentConfigLoadedFailure({
              error: sharedUtilFnErrorTransformer(error),
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const sharedDataAccessConfigEffects = { loadDeploymentConfig };
