import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concatMap, exhaustMap, map, switchMap, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  GesuchAppDataAccessGesuchCockpitActions,
  GesuchAppDataAccessGesuchFormActions,
} from './gesuch-app-data-access-gesuch.actions';
import { GesuchAppDataAccessGesuchService } from './gesuch-app-data-access-gesuch.service';
import { GesuchAppDataAccessGesuchApiActions } from './gesuch-app-data-access-gesuch-api.actions';
import { selectRouteId } from './gesuch-app-data-access-gesuch.selectors';

export const loadGesuchs = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppDataAccessGesuchCockpitActions.init,
        GesuchAppDataAccessGesuchApiActions.gesuchRemovedSuccess
      ),
      switchMap(() =>
        gesuchAppDataAccessGesuchService.getAll().pipe(
          map((gesuchs) =>
            GesuchAppDataAccessGesuchApiActions.gesuchsLoadedSuccess({
              gesuchs,
            })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchApiActions.gesuchsLoadedFailure({
              error: error.message,
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);

export const loadGesuch = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(GesuchAppDataAccessGesuchFormActions.init),
      concatLatestFrom(() => store.select(selectRouteId)),
      switchMap(([, id]) => {
        if (!id) {
          throw new Error(
            'Load Gesuch without id, make sure that the route is correct and contains the gesuch :id'
          );
        }
        return gesuchAppDataAccessGesuchService.get(id).pipe(
          map((gesuch) =>
            GesuchAppDataAccessGesuchApiActions.gesuchLoadedSuccess({ gesuch })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchApiActions.gesuchLoadedFailure({
              error: error.toString(),
            }),
          ])
        );
      })
    );
  },
  { functional: true }
);

export const createGesuch = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(GesuchAppDataAccessGesuchCockpitActions.newTriggered),
      exhaustMap(() =>
        gesuchAppDataAccessGesuchService.create().pipe(
          map(({ id }) =>
            GesuchAppDataAccessGesuchApiActions.gesuchCreatedSuccess({
              id,
              target: 'gesuch-app-feature-gesuch-form-person',
            })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchApiActions.gesuchCreatedFailure({
              error: error.types,
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);

export const updateGesuch = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppDataAccessGesuchFormActions.nextStepTriggered,
        GesuchAppDataAccessGesuchFormActions.prevStepTriggered
      ),
      concatMap(({ gesuch, target }) =>
        gesuchAppDataAccessGesuchService.update(gesuch).pipe(
          map(() =>
            GesuchAppDataAccessGesuchApiActions.gesuchUpdatedSuccess({
              id: gesuch.id!,
              target,
            })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchApiActions.gesuchUpdatedFailure({
              error: error.toString(),
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);

export const removeGesuch = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(GesuchAppDataAccessGesuchCockpitActions.removeTriggered),
      concatMap(({ id }) =>
        gesuchAppDataAccessGesuchService.remove(id).pipe(
          map(() => GesuchAppDataAccessGesuchApiActions.gesuchRemovedSuccess()),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchApiActions.gesuchRemovedFailure({
              error: error.toString(),
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);

export const redirectToGesuchForm = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(
        GesuchAppDataAccessGesuchApiActions.gesuchCreatedSuccess,
        GesuchAppDataAccessGesuchApiActions.gesuchUpdatedSuccess
      ),
      tap(({ id, target }) => {
        router.navigate([target, id]);
      })
    );
  },
  { functional: true, dispatch: false }
);

// add effects here
export const gesuchAppDataAccessGesuchEffects = {
  loadGesuchs,
  loadGesuch,
  createGesuch,
  updateGesuch,
  removeGesuch,
  redirectToGesuchForm,
};
