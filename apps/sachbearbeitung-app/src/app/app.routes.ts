import { Route } from '@angular/router';
import { hasBenutzer } from '@dv/shared/pattern/global-guards';

export const appRoutes: Route[] = [
  {
    path: 'sachbearbeitung-app-feature-cockpit',
    canActivate: [hasBenutzer],
    loadChildren: () =>
      import('@dv/sachbearbeitung-app/feature/cockpit').then(
        (m) => m.sachbearbeitungAppFeatureCockpitRoutes
      ),
  },
];

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sachbearbeitung-app-feature-cockpit',
  },
  ...appRoutes,
  {
    path: '**',
    redirectTo: 'sachbearbeitung-app-feature-cockpit',
  },
];
