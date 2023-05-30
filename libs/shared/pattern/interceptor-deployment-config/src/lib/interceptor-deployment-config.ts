import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { concatMap, filter, take } from 'rxjs';

import { selectDeploymentConfig } from '@dv/shared/data-access/config';
import { SHARED_MODEL_CONFIG_RESOURCE } from '@dv/shared/model/config';

export function SharedPatternInterceptorDeploymentConfig(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const store = inject(Store);
  if (
    ['/assets/', SHARED_MODEL_CONFIG_RESOURCE].some((url) =>
      req.url.includes(url)
    )
  ) {
    return next(req);
  }
  return store.select(selectDeploymentConfig).pipe(
    filter((deploymentConfig) => deploymentConfig !== undefined),
    take(1),
    concatMap((deploymentConfig) => {
      const { environment = '', version = '' } = deploymentConfig ?? {};
      const clonedRequest = req.clone({
        headers: req.headers
          .append('environment', environment)
          .append('version', version),
      });
      return next(clonedRequest);
    })
  );
}
