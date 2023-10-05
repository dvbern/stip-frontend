/**
 * Pattern is an eagerly loaded feature
 * or in other words a combination of other utils, data-access, ui, etc...
 * which are imported eagerly in eager part of the application or other lazy loaded features
 *
 * Please, put implementation in the /lib folder which should be a sibling od this index.ts file.
 *
 *
 * Examples:
 *
 * 1. collection of preconfigured providers
 * export function provide<Scope>Pattern<Name>() {
 *   return [
 *     ...providers (and their configuration, ...)
 *   ]
 * }
 *
 * 2. a piece of reusable logic  (eg components + data accesses)
 *    which is shared by multiple lazy loaded features
 *    eg generic comments feature, document management feature, ...
 */

import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, NgZone, importProvidersFrom } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { switchMap } from 'rxjs/operators';

import { SharedModelCompiletimeConfig } from '@dv/shared/model/config';

function initializeKeycloak(
  ngZone: NgZone,
  keycloak: KeycloakService,
  http: HttpClient,
  compileTimeConfig: SharedModelCompiletimeConfig
) {
  return () =>
    http
      .get<{
        clientAuth: {
          authServerUrl: string;
          realm: string;
        };
        // TODO: Use generated openapi services
      }>('/api/v1/tenant/current')
      .pipe(
        switchMap(({ clientAuth }) => {
          return new Promise<boolean>((resolve, reject) => {
            ngZone.runOutsideAngular(() => {
              keycloak
                .init({
                  config: {
                    url: clientAuth.authServerUrl,
                    realm: clientAuth.realm,
                    clientId: compileTimeConfig.authClientId,
                  },
                  initOptions: {
                    onLoad: 'login-required',
                    checkLoginIframe: true,
                    checkLoginIframeInterval: 30,
                  },
                  // TODO: Add silent check sso
                  shouldAddToken: (request) => {
                    const { method, url } = request;

                    const acceptablePaths = ['/api/v1'];
                    const isAcceptablePathMatch = acceptablePaths.some((path) =>
                      url.startsWith(path)
                    );

                    return !(method !== 'OPTIONS' && isAcceptablePathMatch);
                  },
                })
                .then(() => resolve(true))
                .catch((err) => reject(err));
            });
          });
        })
      );
}

export const provideSharedPatternAppInitialization = () => {
  return [
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [NgZone, KeycloakService, HttpClient, SharedModelCompiletimeConfig],
    },
  ];
};
