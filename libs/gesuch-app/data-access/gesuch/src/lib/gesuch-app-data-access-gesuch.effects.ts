import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, concatMap, exhaustMap, map, switchMap, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';

import { GesuchAppDataAccessGesuchService } from './gesuch-app-data-access-gesuch.service';
import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';
import { selectRouteId } from './gesuch-app-data-access-gesuch.selectors';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';

export const loadGesuchs = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppEventCockpit.init,
        GesuchAppDataAccessGesuchEvents.gesuchRemovedSuccess
      ),
      switchMap(() =>
        gesuchAppDataAccessGesuchService.getAll().pipe(
          map((gesuchs) =>
            GesuchAppDataAccessGesuchEvents.gesuchsLoadedSuccess({
              gesuchs,
            })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchEvents.gesuchsLoadedFailure({
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
      ofType(GesuchAppEventGesuchFormPerson.init),
      concatLatestFrom(() => store.select(selectRouteId)),
      switchMap(([, id]) => {
        if (!id) {
          throw new Error(
            'Load Gesuch without id, make sure that the route is correct and contains the gesuch :id'
          );
        }
        return gesuchAppDataAccessGesuchService.get(id).pipe(
          map((gesuch) =>
            GesuchAppDataAccessGesuchEvents.gesuchLoadedSuccess({ gesuch })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchEvents.gesuchLoadedFailure({
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
      ofType(GesuchAppEventCockpit.newTriggered),
      exhaustMap(({periodeId}) =>
        gesuchAppDataAccessGesuchService.create(periodeId).pipe(
          map(({ id }) =>
            GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess({
              id,
              target: 'gesuch-app-feature-gesuch-form-person',
            })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchEvents.gesuchCreatedFailure({
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
        GesuchAppEventGesuchFormPerson.nextStepTriggered,
        GesuchAppEventGesuchFormPerson.prevStepTriggered
      ),
      concatMap(({ gesuch, target }) =>
        gesuchAppDataAccessGesuchService.update(gesuch).pipe(
          map(() =>
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess({
              id: gesuch.id!,
              target,
            })
          ),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedFailure({
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
      ofType(GesuchAppEventCockpit.removeTriggered),
      concatMap(({ id }) =>
        gesuchAppDataAccessGesuchService.remove(id).pipe(
          map(() => GesuchAppDataAccessGesuchEvents.gesuchRemovedSuccess()),
          catchError(({ error }) => [
            GesuchAppDataAccessGesuchEvents.gesuchRemovedFailure({
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
        GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess,
        GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess
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
