import { inject } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';

export const hasBenutzer = () => {
  const keycloakService = inject(KeycloakService);
  return keycloakService.isLoggedIn().then((isLoggedIn) =>
    isLoggedIn
      ? Promise.resolve(true)
      : // TODO: show landing page if not logged in
        (console.error('IS NOT LOGGED IN'), Promise.resolve(true))
  );
};
