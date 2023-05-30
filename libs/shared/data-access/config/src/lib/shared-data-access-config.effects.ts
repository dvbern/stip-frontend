import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { SharedDataAccessConfigService } from './shared-data-access-config.service';
import { SharedDataAccessConfigActions } from './shared-data-access-config.actions';
import { SharedDataAccessConfigApiActions } from './shared-data-access-config-api.actions';

export const loadDeploymentConfig = createEffect(
  (
    actions$ = inject(Actions),
    sharedDataAccessConfigService = inject(SharedDataAccessConfigService)
  ) => {
    return actions$.pipe(
      ofType(SharedDataAccessConfigActions.appInit),
      switchMap(() =>
        sharedDataAccessConfigService.getDeploymentConfig().pipe(
          map((deploymentConfig) =>
            SharedDataAccessConfigApiActions.deploymentConfigLoadedSuccess({
              deploymentConfig,
            })
          ),
          catchError((error: { message: string }) =>
            of(
              SharedDataAccessConfigApiActions.deploymentConfigLoadedFailure({
                error: error.message,
              })
            )
          )
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const sharedDataAccessConfigEffects = { loadDeploymentConfig };
