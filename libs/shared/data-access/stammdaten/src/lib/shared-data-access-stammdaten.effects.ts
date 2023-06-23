import { inject } from '@angular/core';
import { catchError, switchMap, map } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

import { SharedDataAccessStammdatenService } from './shared-data-access-stammdaten.service';
import { SharedDataAccessStammdatenApiEvents } from './shared-data-access-stammdaten.events';

export const loadStammdatens = createEffect(
  (
    events$ = inject(Actions),
    sharedDataAccessStammdatenService = inject(
      SharedDataAccessStammdatenService
    )
  ) => {
    return events$.pipe(
      ofType(SharedDataAccessStammdatenApiEvents.init),
      switchMap(() =>
        sharedDataAccessStammdatenService.getAll().pipe(
          map((laender) =>
            SharedDataAccessStammdatenApiEvents.stammdatensLoadedSuccess({
              laender,
            })
          ),
          catchError((error) => [
            SharedDataAccessStammdatenApiEvents.stammdatensLoadedFailure({
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
export const sharedDataAccessStammdatenEffects = { loadStammdatens };
