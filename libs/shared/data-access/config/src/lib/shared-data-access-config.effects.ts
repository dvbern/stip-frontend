import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

import { SharedDataAccessConfigEvents } from './shared-data-access-config.events';
import { ConfigurationService } from '@dv/shared/model/gesuch';

export const loadDeploymentConfig = createEffect(
  (
    actions$ = inject(Actions),
    configurationService = inject(ConfigurationService)
  ) => {
    return actions$.pipe(
      ofType(SharedDataAccessConfigEvents.appInit),
      switchMap(() =>
        configurationService.getDeploymentConfig$().pipe(
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
