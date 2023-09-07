import { Route } from '@angular/router';

import { SachbearbeitungAppFeatureGesuchFormComponent } from '@dv/sachbearbeitung-app/pattern/gesuch-step-wrapper';
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
  {
    path: 'gesuch',
    canActivate: [hasBenutzer],
    component: SachbearbeitungAppFeatureGesuchFormComponent,
    loadChildren: () =>
      import('@dv/sachbearbeitung-app/feature/gesuch-form').then(
        (m) => m.gesuchAppFeatureGesuchFormRoutes
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
