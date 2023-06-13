import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { GesuchAppDataAccessElternService } from './gesuch-app-data-access-eltern.service';
import { GesuchAppDataAccessElternApiEvents } from './gesuch-app-data-access-eltern.events';
import {
  GesuchAppEventGesuchFormMutter,
  GesuchAppEventGesuchFormVater,
} from '@dv/gesuch-app/event/gesuch-form-eltern';
import { Store } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import { Anrede } from '@dv/shared/model/gesuch';

const { selectRouteDataParam, selectRouteParam } = getRouterSelectors();

export const loadElterns = createEffect(
  (
    events$ = inject(Actions),
    store = inject(Store),
    gesuchAppDataAccessElternService = inject(GesuchAppDataAccessElternService)
  ) => {
    return events$.pipe(
      ofType(
        GesuchAppEventGesuchFormVater.init,
        GesuchAppEventGesuchFormMutter.init
      ),
      concatLatestFrom(() => [
        store.select(selectRouteParam('id')),
        store.select(selectRouteDataParam('type')),
      ]),
      switchMap(([, id, type]) => {
        if (!id) {
          throw new Error(
            'Load Gesuch without id, make sure that the route is correct and contains the gesuch :id'
          );
        }
        return gesuchAppDataAccessElternService
          .getElternForGesuch(id, type as Anrede)
          .pipe(
            map((elternContainer) =>
              GesuchAppDataAccessElternApiEvents.elternsLoadedSuccess({
                elternContainer,
              })
            ),
            catchError((error: { message: string }) => [
              GesuchAppDataAccessElternApiEvents.elternsLoadedFailure({
                error: error.message,
              }),
            ])
          );
      })
    );
  },
  { functional: true }
);

// add effects here
export const gesuchAppDataAccessElternEffects = { loadElterns };
