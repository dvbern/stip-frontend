import {inject} from '@angular/core';
import {Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, switchMap, tap } from 'rxjs';

import {GesuchAppEventCockpit} from '@dv/gesuch-app/event/cockpit';
import {GesuchAppEventGesuchFormEducation} from '@dv/gesuch-app/event/gesuch-form-education';
import {GesuchAppEventGesuchFormPerson} from '@dv/gesuch-app/event/gesuch-form-person';
import {GesuchFormSteps, NavigationType} from '@dv/gesuch-app/model/gesuch-form';
import {GesuchAppUtilGesuchFormStepManagerService} from '@dv/gesuch-app/util/gesuch-form-step-manager';

import {GesuchAppDataAccessGesuchEvents} from './gesuch-app-data-access-gesuch.events';
import {selectRouteId} from './gesuch-app-data-access-gesuch.selectors';

import {GesuchAppDataAccessGesuchService} from './gesuch-app-data-access-gesuch.service';

export const loadGesuchs = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService),
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppEventCockpit.init,
        GesuchAppDataAccessGesuchEvents.gesuchRemovedSuccess,
      ),
      switchMap(() =>
        gesuchAppDataAccessGesuchService.getAll().pipe(
          map((gesuchs) =>
            GesuchAppDataAccessGesuchEvents.gesuchsLoadedSuccess({
              gesuchs,
            }),
          ),
          catchError(({error}) => [
            GesuchAppDataAccessGesuchEvents.gesuchsLoadedFailure({
              error: error.message,
            }),
          ]),
        ),
      ),
    );
  },
  {functional: true},
);

export const loadGesuch = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService),
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppEventGesuchFormPerson.init,
        GesuchAppEventGesuchFormEducation.init,
      ),
      concatLatestFrom(() => store.select(selectRouteId)),
      switchMap(([, id]) => {
        if (!id) {
          throw new Error(
            'Load Gesuch without id, make sure that the route is correct and contains the gesuch :id',
          );
        }
        return gesuchAppDataAccessGesuchService.get(id).pipe(
          map((gesuch) =>
            GesuchAppDataAccessGesuchEvents.gesuchLoadedSuccess({gesuch}),
          ),
          catchError(({error}) => [
            GesuchAppDataAccessGesuchEvents.gesuchLoadedFailure({
              error: error.toString(),
            }),
          ]),
        );
      }),
    );
  },
  {functional: true},
);

export const createGesuch = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService),
  ) => {
    return actions$.pipe(
      ofType(GesuchAppEventCockpit.newTriggered),
      exhaustMap(({periodeId, origin}) =>
        gesuchAppDataAccessGesuchService.create(periodeId).pipe(
          map(({id}) =>
            GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess({
              id,
              origin,
              navigationType: NavigationType.FORWARDS,
            }),
          ),
          catchError(({error}) => [
            GesuchAppDataAccessGesuchEvents.gesuchCreatedFailure({
              error: error.types,
            }),
          ]),
        ),
      ),
    );
  },
  {functional: true},
);

export const updateGesuch = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService),
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppEventGesuchFormPerson.nextStepTriggered,
        GesuchAppEventGesuchFormPerson.prevStepTriggered,
        GesuchAppEventGesuchFormEducation.nextStepTriggered,
        GesuchAppEventGesuchFormEducation.prevStepTriggered,
      ),
      concatMap(({gesuch, origin, navigationType}) => {
        return gesuchAppDataAccessGesuchService.update(gesuch).pipe(
          map(() =>
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess({
              id: gesuch.id!,
              origin,
              navigationType,
            }),
          ),
          catchError(({error}) => [
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedFailure({
              error: error.toString(),
            }),
          ]),
        );
      }),
    );
  },
  {functional: true},
);

export const removeGesuch = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService),
  ) => {
    return actions$.pipe(
      ofType(GesuchAppEventCockpit.removeTriggered),
      concatMap(({id}) =>
        gesuchAppDataAccessGesuchService.remove(id).pipe(
          map(() => GesuchAppDataAccessGesuchEvents.gesuchRemovedSuccess()),
          catchError(({error}) => [
            GesuchAppDataAccessGesuchEvents.gesuchRemovedFailure({
              error: error.toString(),
            }),
          ]),
        ),
      ),
    );
  },
  {functional: true},
);

export const redirectToGesuchForm = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    stepManager = inject(GesuchAppUtilGesuchFormStepManagerService),
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess,
        GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess,
      ),
      tap(({id, origin, navigationType}) => {
        const target = navigationType === NavigationType.FORWARDS ?
          stepManager.getNext(origin) :
          stepManager.getPrevious(origin);
        router.navigate([target.name, id]);
      }),
    );
  },
  {functional: true, dispatch: false},
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
