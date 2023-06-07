import { Route } from '@angular/router';
import {GesuchFormSteps} from '@dv/gesuch-app/model/gesuch-form';

export const appRoutes: Route[] = [
  {
    path: GesuchFormSteps.FAMILIENSITUATION.name,
    title: 'gesuch-app.familiensituation.title',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-familiensituation').then(
        (m) => m.gesuchAppFeatureGesuchFormFamiliensituationRoutes
      ),
  },
  {
    path: 'gesuch-app-feature-eltern',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/eltern').then(
        (m) => m.gesuchAppFeatureElternRoutes
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'gesuch-app-feature-cockpit',
  },
  {
    path: 'gesuch-app-feature-cockpit',
    title: 'gesuch-app.cockpit.title',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/cockpit').then(
        (m) => m.gesuchAppFeatureCockpitRoutes
      ),
  },
  {
    path: 'gesuch-app-feature-gesuch-form-person',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-person').then(
        (m) => m.gesuchAppFeatureGesuchFormPersonRoutes
      ),
  },
  {
    path: 'gesuch-app-feature-gesuch-form-education',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-education').then(
        (m) => m.gesuchAppFeatureGesuchFormEducationRoutes
      ),
  },

  {
    path: '**',
    redirectTo: 'gesuch-app-feature-cockpit',
  },
];
