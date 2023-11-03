import { inject } from '@angular/core';
import { Router } from '@angular/router';
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

import { SharedEventGesuchFormGeschwister } from '@dv/shared/event/gesuch-form-geschwister';
import { SharedEventGesuchFormKinder } from '@dv/shared/event/gesuch-form-kinder';
import { SharedEventGesuchFormLebenslauf } from '@dv/shared/event/gesuch-form-lebenslauf';
import { SharedEventGesuchFormAuszahlung } from '@dv/shared/event/gesuch-form-auszahlung';
import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { SharedEventGesuchFormPerson } from '@dv/shared/event/gesuch-form-person';
import { SharedEventGesuchFormFamiliensituation } from '@dv/shared/event/gesuch-form-familiensituation';
import { SharedUtilGesuchFormStepManagerService } from '@dv/shared/util/gesuch-form-step-manager';
import { PERSON } from '@dv/shared/model/gesuch-form';
import { SharedEventGesuchFormEltern } from '@dv/shared/event/gesuch-form-eltern';
import { SharedEventGesuchFormEinnahmenkosten } from '@dv/shared/event/gesuch-form-einnahmenkosten';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';
import { SharedEventGesuchFormPartner } from '@dv/shared/event/gesuch-form-partner';
import { SharedEventGesuchFormAbschluss } from '@dv/shared/event/gesuch-form-abschluss';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
import { GesuchFormularUpdate, GesuchService } from '@dv/shared/model/gesuch';
import { selectCurrentBenutzer } from '@dv/shared/data-access/benutzer';

import { selectRouteId } from './shared-data-access-gesuch.selectors';
import { SharedDataAccessGesuchEvents } from './shared-data-access-gesuch.events';

export const loadOwnGesuchs = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    gesuchService = inject(GesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        SharedDataAccessGesuchEvents.init,
        SharedDataAccessGesuchEvents.gesuchRemovedSuccess
      ),
      switchMap(() => store.select(selectCurrentBenutzer)),
      filter(sharedUtilFnTypeGuardsIsDefined),
      concatMap((benutzer) =>
        gesuchService.getGesucheForBenutzer$({ benutzerId: benutzer.id }).pipe(
          map((gesuchs) =>
            SharedDataAccessGesuchEvents.gesuchsLoadedSuccess({
              gesuchs,
            })
          ),
          catchError((error) => [
            SharedDataAccessGesuchEvents.gesuchsLoadedFailure({
              error: sharedUtilFnErrorTransformer(error),
            }),
          ])
        )
      )
    );
  },
  { functional: true }
);
export const loadAllGesuchs = createEffect(
  (actions$ = inject(Actions), gesuchService = inject(GesuchService)) => {
    return actions$.pipe(
      ofType(SharedDataAccessGesuchEvents.loadAll),
      filter(sharedUtilFnTypeGuardsIsDefined),
      concatMap(() =>
        gesuchService.getGesuche$().pipe(
          map((gesuchs) =>
            SharedDataAccessGesuchEvents.gesuchsLoadedSuccess({
              gesuchs,
            })
          ),
          catchError((error) => [
            SharedDataAccessGesuchEvents.gesuchsLoadedFailure({
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
    gesuchService = inject(GesuchService)
  ) => {
    return actions$.pipe(
      ofType(
        SharedEventGesuchFormPartner.init,
        SharedEventGesuchFormPerson.init,
        SharedEventGesuchFormEducation.init,
        SharedEventGesuchFormEltern.init,
        SharedEventGesuchFormFamiliensituation.init,
        SharedEventGesuchFormAuszahlung.init,
        SharedEventGesuchFormGeschwister.init,
        SharedEventGesuchFormKinder.init,
        SharedEventGesuchFormLebenslauf.init,
        SharedEventGesuchFormEinnahmenkosten.init,
        SharedEventGesuchFormAbschluss.init
      ),
      concatLatestFrom(() => store.select(selectRouteId)),
      switchMap(([, id]) => {
        if (!id) {
          throw new Error(
            'Load Gesuch without id, make sure that the route is correct and contains the gesuch :id'
          );
        }
        return gesuchService.getGesuch$({ gesuchId: id }).pipe(
          map((gesuch) =>
            SharedDataAccessGesuchEvents.gesuchLoadedSuccess({ gesuch })
          ),
          catchError((error) => [
            SharedDataAccessGesuchEvents.gesuchLoadedFailure({
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
  (actions$ = inject(Actions), gesuchService = inject(GesuchService)) => {
    return actions$.pipe(
      ofType(SharedDataAccessGesuchEvents.newTriggered),
      exhaustMap(({ create }) =>
        gesuchService.createGesuch$({ gesuchCreate: create }).pipe(
          switchMap(() =>
            gesuchService.getGesucheForFall$({
              fallId: create.fallId,
            })
          ),
          map(
            (gesuche) =>
              gesuche.find(
                ({ gesuchsperiode: { id } }) => id === create.gesuchsperiodeId
              )?.id
          ),
          filter(sharedUtilFnTypeGuardsIsDefined),
          map((id) =>
            SharedDataAccessGesuchEvents.gesuchCreatedSuccess({
              id,
            })
          ),
          catchError((error) => [
            SharedDataAccessGesuchEvents.gesuchCreatedFailure({
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
  (actions$ = inject(Actions), gesuchService = inject(GesuchService)) => {
    return actions$.pipe(
      ofType(
        SharedEventGesuchFormPartner.nextStepTriggered,
        SharedEventGesuchFormPerson.saveTriggered,
        SharedEventGesuchFormEducation.saveTriggered,
        SharedEventGesuchFormFamiliensituation.saveTriggered,
        SharedEventGesuchFormAuszahlung.saveTriggered,
        SharedEventGesuchFormEinnahmenkosten.saveTriggered
      ),
      concatMap(({ gesuchId, trancheId, gesuchFormular, origin }) => {
        return gesuchService
          .updateGesuch$({
            gesuchId,
            gesuchUpdate: prepareFormularData(trancheId, gesuchFormular),
          })
          .pipe(
            map(() =>
              SharedDataAccessGesuchEvents.gesuchUpdatedSuccess({
                id: gesuchId,
                origin,
              })
            ),
            catchError((error) => [
              SharedDataAccessGesuchEvents.gesuchUpdatedFailure({
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
  (actions$ = inject(Actions), gesuchService = inject(GesuchService)) => {
    return actions$.pipe(
      ofType(
        SharedEventGesuchFormEltern.saveSubformTriggered,
        SharedEventGesuchFormGeschwister.saveSubformTriggered,
        SharedEventGesuchFormKinder.saveSubformTriggered,
        SharedEventGesuchFormLebenslauf.saveSubformTriggered
      ),
      concatMap(({ gesuchId, trancheId, gesuchFormular, origin }) => {
        return gesuchService
          .updateGesuch$({
            gesuchId,
            gesuchUpdate: prepareFormularData(trancheId, gesuchFormular),
          })
          .pipe(
            map(() =>
              SharedDataAccessGesuchEvents.gesuchUpdatedSubformSuccess({
                id: gesuchId,
                origin,
              })
            ),
            catchError((error) => [
              SharedDataAccessGesuchEvents.gesuchUpdatedSubformFailure({
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
  (actions$ = inject(Actions), gesuchService = inject(GesuchService)) => {
    return actions$.pipe(
      ofType(SharedDataAccessGesuchEvents.removeTriggered),
      concatMap(({ id }) =>
        gesuchService.deleteGesuch$({ gesuchId: id }).pipe(
          map(() => SharedDataAccessGesuchEvents.gesuchRemovedSuccess()),
          catchError((error) => [
            SharedDataAccessGesuchEvents.gesuchRemovedFailure({
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
      ofType(SharedDataAccessGesuchEvents.gesuchCreatedSuccess),
      tap(({ id }) => {
        router.navigate(['gesuch', PERSON.route, id]);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const redirectToGesuchFormNextStep = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    stepManager = inject(SharedUtilGesuchFormStepManagerService)
  ) => {
    return actions$.pipe(
      ofType(
        SharedDataAccessGesuchEvents.gesuchUpdatedSuccess,
        SharedEventGesuchFormEltern.nextTriggered,
        SharedEventGesuchFormGeschwister.nextTriggered,
        SharedEventGesuchFormKinder.nextTriggered,
        SharedEventGesuchFormLebenslauf.nextTriggered,
        SharedEventGesuchFormPartner.nextTriggered,
        SharedEventGesuchFormPerson.nextTriggered,
        SharedEventGesuchFormEducation.nextTriggered,
        SharedEventGesuchFormFamiliensituation.nextTriggered,
        SharedEventGesuchFormAuszahlung.nextTriggered,
        SharedEventGesuchFormEinnahmenkosten.nextTriggered
      ),
      tap(({ id, origin }) => {
        const target = stepManager.getNext(origin);
        router.navigate(['gesuch', target.route, id]);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const refreshGesuchFormStep = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(SharedDataAccessGesuchEvents.gesuchUpdatedSubformSuccess),
      tap(({ id, origin }) => {
        router.navigate(['gesuch', origin.route, id]);
      })
    );
  },
  { functional: true, dispatch: false }
);

// add effects here
export const sharedDataAccessGesuchEffects = {
  loadOwnGesuchs,
  loadAllGesuchs,
  loadGesuch,
  createGesuch,
  updateGesuch,
  updateGesuchSubform,
  removeGesuch,
  redirectToGesuchForm,
  redirectToGesuchFormNextStep,
  refreshGesuchFormStep,
};

const prepareFormularData = (
  id: string,
  gesuchFormular: GesuchFormularUpdate
) => {
  const { lebenslaufItems, geschwisters, elterns, kinds, ...formular } =
    gesuchFormular;
  return {
    gesuchTrancheToWorkWith: {
      id,
      gesuchFormular: {
        ...formular,
        lebenslaufItems: lebenslaufItems?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
        elterns: elterns?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
        kinds: kinds?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
        geschwisters: geschwisters?.map((i) => ({
          ...i,
          copyOfId: undefined,
        })),
      },
    },
  };
};
