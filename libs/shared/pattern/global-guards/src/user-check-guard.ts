import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { getBenutzerId } from '@dv/shared/util-fn/local-storage-helper';

export const hasBenutzer = () => {
  const router = inject(Router);
  return !getBenutzerId()
    ? true
    : router.navigate(['/gesuch-app-feature-cockpit']);
};

export const hasNoBenutzer = () => {
  const router = inject(Router);
  return !getBenutzerId() ? router.navigate(['/']) : true;
};
