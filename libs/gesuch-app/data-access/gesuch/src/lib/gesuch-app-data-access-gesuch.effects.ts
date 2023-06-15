import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/gesuch-app/event/gesuch-form-geschwister';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, switchMap, tap } from 'rxjs';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { GesuchAppUtilGesuchFormStepManagerService } from '@dv/gesuch-app/util/gesuch-form-step-manager';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';

import { selectRouteId } from './gesuch-app-data-access-gesuch.selectors';
import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';
import { GesuchAppDataAccessGesuchService } from './gesuch-app-data-access-gesuch.service';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

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
      concatMap(() =>
        gesuchAppDataAccessGesuchService.getAll().pipe(
          map((gesuchs) =>
            GesuchAppDataAccessGesuchEvents.gesuchsLoadedSuccess({
              gesuchs,
            })
          ),
          catchError((error) => [
            GesuchAppDataAccessGesuchEvents.gesuchsLoadedFailure({
              error: sharedUtilFnErrorTransformer(error),
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
      ofType(
        GesuchAppEventGesuchFormPerson.init,
        GesuchAppEventGesuchFormEducation.init,
        GesuchAppEventGesuchFormFamiliensituation.init,
        GesuchAppEventGesuchFormEltern.init,
        GesuchAppEventGesuchFormGeschwister.init,
        GesuchAppEventGesuchFormLebenslauf.init
      ),
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
          catchError((error) => [
            GesuchAppDataAccessGesuchEvents.gesuchLoadedFailure({
              error: sharedUtilFnErrorTransformer(error),
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
      exhaustMap(({ gesuch }) =>
        gesuchAppDataAccessGesuchService.create(gesuch).pipe(
          map(({ id }) =>
            GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess({ id })
          ),
          catchError((error) => [
            GesuchAppDataAccessGesuchEvents.gesuchCreatedFailure({
              error: sharedUtilFnErrorTransformer(error),
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
        GesuchAppEventGesuchFormPerson.saveTriggered,
        GesuchAppEventGesuchFormEducation.saveTriggered,
        GesuchAppEventGesuchFormFamiliensituation.saveTriggered
      ),
      concatMap(({ gesuch, origin }) => {
        return gesuchAppDataAccessGesuchService.update(gesuch).pipe(
          map(() =>
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess({
              id: gesuch.id!,
              origin,
            })
          ),
          catchError((error) => [
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedFailure({
              error: sharedUtilFnErrorTransformer(error),
            }),
          ])
        );
      })
    );
  },
  { functional: true }
);

export const updateGesuchSubform = createEffect(
  (
    actions$ = inject(Actions),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppEventGesuchFormEltern.saveSubformTriggered,
        GesuchAppEventGesuchFormGeschwister.saveSubformTriggered,
        GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered
      ),
      concatMap(({ gesuch, origin }) => {
        return gesuchAppDataAccessGesuchService.update(gesuch).pipe(
          map(() =>
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformSuccess({
              id: gesuch.id!,
              origin,
            })
          ),
          catchError((error) => [
            GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformFailure({
              error: sharedUtilFnErrorTransformer(error),
            }),
          ])
        );
      })
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
          catchError((error) => [
            GesuchAppDataAccessGesuchEvents.gesuchRemovedFailure({
              error: sharedUtilFnErrorTransformer(error),
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
      ofType(GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess),
      tap(({ id }) => {
        router.navigate([GesuchFormSteps.PERSON.route, id]);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const redirectToGesuchFormNextStep = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    stepManager = inject(GesuchAppUtilGesuchFormStepManagerService)
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess,
        GesuchAppEventGesuchFormEltern.nextTriggered,
        GesuchAppEventGesuchFormGeschwister.nextTriggered,
        GesuchAppEventGesuchFormLebenslauf.nextTriggered
      ),
      tap(({ id, origin }) => {
        const target = stepManager.getNext(origin);
        router.navigate([target.route, id]);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const refreshGesuchFormStep = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformSuccess),
      tap(({ id, origin }) => {
        router.navigate([origin.route, id]);
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
  updateGesuchSubform,
  removeGesuch,
  redirectToGesuchForm,
  redirectToGesuchFormNextStep,
  refreshGesuchFormStep,
};
