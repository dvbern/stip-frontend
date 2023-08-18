import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, concatMap, filter, from, switchMap, take } from 'rxjs';

import { selectDeploymentConfig } from '@dv/shared/data-access/config';
import { SHARED_MODEL_CONFIG_RESOURCE } from '@dv/shared/model/config';
import { KeycloakService } from 'keycloak-angular';

export function SharedPatternInterceptorDeploymentConfig(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const keyCloakService = inject(KeycloakService);
  const store = inject(Store);

  if (
    ['/assets/', SHARED_MODEL_CONFIG_RESOURCE].some((url) =>
      req.url.includes(url)
    )
  ) {
    return next(req);
  }

  return combineLatest([
    store.select(selectDeploymentConfig).pipe(
      filter((deploymentConfig) => deploymentConfig !== undefined),
      take(1)
    ),
    from(keyCloakService.isLoggedIn()).pipe(
      switchMap((isLoggedIn) =>
        isLoggedIn
          ? keyCloakService.addTokenToHeader(req.headers)
          : [req.headers]
      )
    ),
  ]).pipe(
    concatMap(([deploymentConfig, headers]) => {
      const { environment = '', version = '' } = deploymentConfig ?? {};
      return next(
        req.clone({
          headers: headers
            .append('environment', environment)
            .append('version', version),
        })
      );
    })
  );
}
