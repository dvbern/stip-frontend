import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, throwError } from 'rxjs';

import { SharedDataAccessGlobalNotificationEvents } from '@dv/shared/data-access/global-notification';
import { sharedUtilFnErrorTransformer } from '@dv/shared/util-fn/error-transformer';

export interface DvGlobalHttpErrorInterceptorFnOptions {
  /*
  Choose the type of global error handling you want for the application.
  - globalOnly: the global interceptor catches all http errors and dispatches them to the global notification API. Local catchErrors will never be reached.
  - globalAndLocal: the global interceptor catches http errors and dispatches them to the notification API first. After this, the local catchErrors will be executed.
  - without: only local catchErrors are used. Choose this options if at some point you do not want to dispatch an error to the global notification API.

   */
  type: 'without' | 'globalOnly' | 'globalAndLocal';
}

export function withDvGlobalHttpErrorInterceptorFn({
  type,
}: DvGlobalHttpErrorInterceptorFnOptions) {
  if (type === 'without') {
    return [];
  } else {
    // explicit function name is displayed in stack traces, arrow functions are anonymous
    // eslint-disable-next-line no-inner-declarations
    function HttpErrorInterceptor(
      req: HttpRequest<unknown>,
      next: HttpHandlerFn
    ) {
      const store = inject(Store);
      return next(req).pipe(
        catchError((error) => {
          store.dispatch(
            SharedDataAccessGlobalNotificationEvents.httpRequestFailed({
              errors: [sharedUtilFnErrorTransformer(error)],
            })
          );

          if (type === 'globalOnly') {
            return EMPTY; // global errors only. Effects will never fail, no local catchErrors are reached
          } else {
            console.log('forward error to local error handling');
            // TODO fix this: throwError stops stuff and the local error handling is not reached
            return throwError(error); // global errors plus local catchErrors in Effects.
          }
        })
      );
    }

    return [HttpErrorInterceptor];
  }
}
