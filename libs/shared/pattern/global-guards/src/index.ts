import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { KeycloakService } from 'keycloak-angular';

export const hasBenutzer: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  return keycloakService.isLoggedIn().then((isLoggedIn) => {
    return isLoggedIn
      ? Promise.resolve(true)
      : // TODO: show landing page if not logged in
        Promise.resolve(false);
  });
};
