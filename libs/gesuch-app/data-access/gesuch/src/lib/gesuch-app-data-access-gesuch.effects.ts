import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/gesuch-app/event/gesuch-form-geschwister';
import { GesuchAppEventGesuchFormKinder } from '@dv/gesuch-app/event/gesuch-form-kinder';
import { GesuchAppEventGesuchFormLebenslauf } from '@dv/gesuch-app/event/gesuch-form-lebenslauf';
import { GesuchAppEventGesuchFormAuszahlung } from '@dv/gesuch-app/event/gesuch-form-auszahlung';
import { Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchAppEventGesuchFormFamiliensituation } from '@dv/gesuch-app/event/gesuch-form-familiensituation';
import { GesuchAppUtilGesuchFormStepManagerService } from '@dv/gesuch-app/util/gesuch-form-step-manager';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { GesuchAppEventGesuchFormPartner } from '@dv/gesuch-app/event/gesuch-form-partner';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';

import { selectRouteId } from './gesuch-app-data-access-gesuch.selectors';
import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';
import { GesuchAppDataAccessGesuchService } from './gesuch-app-data-access-gesuch.service';
import { selectBenutzer } from './gesuch-app-data-access-gesuch.feature';

export const loadGesuchs = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    gesuchAppDataAccessGesuchService = inject(GesuchAppDataAccessGesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        GesuchAppEventCockpit.init,
        GesuchAppDataAccessGesuchEvents.gesuchRemovedSuccess
      ),
      switchMap(() => store.select(selectBenutzer)),
      filter(sharedUtilFnTypeGuardsIsDefined),
      concatMap((benutzer) =>
        gesuchAppDataAccessGesuchService.getAll(benutzer.id).pipe(
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
        GesuchAppEventGesuchFormPartner.init,
        GesuchAppEventGesuchFormPerson.init,
        GesuchAppEventGesuchFormEducation.init,
        GesuchAppEventGesuchFormEltern.init,
        GesuchAppEventGesuchFormFamiliensituation.init,
        GesuchAppEventGesuchFormAuszahlung.init,
        GesuchAppEventGesuchFormGeschwister.init,
        GesuchAppEventGesuchFormKinder.init,
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
      exhaustMap(({ create }) =>
        gesuchAppDataAccessGesuchService.create(create).pipe(
          switchMap(() =>
            gesuchAppDataAccessGesuchService.getByFallId(create.fallId)
          ),
          map(
            (gesuche) =>
              gesuche.find(
                ({ gesuchsperiode: { id } }) => id === create.gesuchsperiodeId
              )?.id
          ),
          filter((id) => id != null),
          map((id) =>
            GesuchAppDataAccessGesuchEvents.gesuchCreatedSuccess({
              id: id!, // TODO cleanup quick workaround
            })
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
        GesuchAppEventGesuchFormPartner.nextStepTriggered,
        GesuchAppEventGesuchFormPerson.saveTriggered,
        GesuchAppEventGesuchFormEducation.saveTriggered,
        GesuchAppEventGesuchFormFamiliensituation.saveTriggered,
        GesuchAppEventGesuchFormAuszahlung.saveTriggered
      ),
      concatMap(({ gesuchId, gesuchFormular, origin }) => {
        return gesuchAppDataAccessGesuchService
          .update(gesuchId, gesuchFormular)
          .pipe(
            map(() =>
              GesuchAppDataAccessGesuchEvents.gesuchUpdatedSuccess({
                id: gesuchId,
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
        GesuchAppEventGesuchFormKinder.saveSubformTriggered,
        GesuchAppEventGesuchFormLebenslauf.saveSubformTriggered
      ),
      concatMap(({ gesuchId, gesuchFormular, origin }) => {
        return gesuchAppDataAccessGesuchService
          .update(gesuchId, gesuchFormular)
          .pipe(
            map(() =>
              GesuchAppDataAccessGesuchEvents.gesuchUpdatedSubformSuccess({
                id: gesuchId,
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
        GesuchAppEventGesuchFormKinder.nextTriggered,
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
