import { Route } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GesuchAppPatternGesuchStepWrapperComponent } from '@dv/gesuch-app/pattern/gesuch-step-wrapper';
import { hasBenutzer } from '@dv/shared/pattern/global-guards';

export const appRoutes: Route[] = [
  {
    path: 'gesuch-app-feature-cockpit',
    canActivate: [hasBenutzer],
    title: 'gesuch-app.cockpit.title',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/cockpit').then(
        (m) => m.gesuchAppFeatureCockpitRoutes
      ),
  },
  {
    path: 'gesuch',
    canActivate: [hasBenutzer],
    component: GesuchAppPatternGesuchStepWrapperComponent,
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form').then(
        (m) => m.gesuchAppFeatureGesuchFormRoutes
      ),
  },
];

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'gesuch-app-feature-cockpit',
  },
  ...appRoutes,
  {
    path: '**',
    redirectTo: 'gesuch-app-feature-cockpit',
  },
];
