import { inject } from '@angular/core';
import { catchError, switchMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { <%= classify(projectName) %>Service } from './<%= dasherize(projectName) %>.service';
import { <%= classify(projectName) %>Actions } from './<%= dasherize(projectName) %>.actions';
import { <%= classify(projectName) %>ApiActions } from './<%= dasherize(projectName) %>-api.actions';

export const load<%= classify(name) %>s = createEffect(
  (actions$ = inject(Actions), <%= camelize(projectName) %>Service = inject(<%= classify(projectName) %>Service)) => {
    return actions$.pipe(
      ofType(<%= classify(projectName) %>Actions.init),
      switchMap(() =>
        <%= camelize(projectName) %>Service.getAll().pipe(
          map((<%= camelize(name) %>s) => <%= classify(projectName) %>ApiActions.<%= camelize(name) %>sLoadedSuccess({ <%= camelize(name) %>s })),
          catchError((error: { message: string }) =>
            of(<%= classify(projectName) %>ApiActions.<%= camelize(name) %>sLoadedFailure({ error: error.message }))
          )
        )
      )
    );
  },
  { functional: true }
);

// add effects here
export const <%= camelize(projectName) %>Effects = {load<%= classify(name) %>s};