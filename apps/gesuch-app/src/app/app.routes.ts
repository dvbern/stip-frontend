import { Route } from '@angular/router';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { hasBenutzer, hasNoBenutzer } from '@dv/shared/pattern/global-guards';

export const appRoutes: Route[] = [
  {
    path: 'gesuch-app-feature-user-select',
    canActivate: [hasNoBenutzer],
    title: 'gesuch-app.user-select.title',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/user-select').then(
        (m) => m.gesuchAppFeatureUserSelectRoutes
      ),
  },
  {
    path: 'gesuch-app-feature-gesuch-form-kinder',
    canActivate: [hasBenutzer],
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-kinder').then(
        (m) => m.gesuchAppFeatureGesuchFormKinderRoutes
      ),
  },
  {
    path: 'gesuch-app-feature-gesuch-form-lebenslauf',
    canActivate: [hasBenutzer],
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-lebenslauf').then(
        (m) => m.gesuchAppFeatureGesuchFormLebenslaufRoutes
      ),
  },
  // {
  //   path: 'gesuch-app-feature-gesuch-form-geschwister',
  //   canActivate: [hasBenutzer],
  //   loadChildren: () =>
  //     import('@dv/gesuch-app/feature/gesuch-form-geschwister').then(
  //       (m) => m.gesuchAppFeatureGesuchFormGeschwisterRoutes
  //     ),
  // },
  // {
  //   path: GesuchFormSteps.AUSZAHLUNGEN.route,
  //   canActivate: [hasBenutzer],
  //   title: 'gesuch-app.auszahlung.title',
  //   loadChildren: () =>
  //     import('@dv/gesuch-app/feature/gesuch-form-auszahlungen').then(
  //       (m) => m.gesuchAppFeatureGesuchFormAuszahlungenRoutes
  //     ),
  // },
  // {
  //   path: GesuchFormSteps.FAMILIENSITUATION.route,
  //   canActivate: [hasBenutzer],
  //   title: 'gesuch-app.familiensituation.title',
  //   loadChildren: () =>
  //     import('@dv/gesuch-app/feature/gesuch-form-familiensituation').then(
  //       (m) => m.gesuchAppFeatureGesuchFormFamiliensituationRoutes
  //     ),
  // },
  // {
  //   path: 'gesuch-app-feature-gesuch-form-partner',
  //   canActivate: [hasBenutzer],
  //   loadChildren: () =>
  //     import('@dv/gesuch-app/feature/gesuch-form-partner').then(
  //       (m) => m.gesuchAppFeatureGesuchFormPartnerRoutes
  //     ),
  // },
  {
    path: 'gesuch-app-feature-cockpit',
    canActivate: [hasBenutzer],
    title: 'gesuch-app.cockpit.title',
    loadChildren: () =>
      import('@dv/gesuch-app/feature/cockpit').then(
        (m) => m.gesuchAppFeatureCockpitRoutes
      ),
  },
  // {
  //   path: 'gesuch-app-feature-gesuch-form-eltern',
  //   canActivate: [hasBenutzer],
  //   loadChildren: () =>
  //     import('@dv/gesuch-app/feature/gesuch-form-eltern').then(
  //       (m) => m.gesuchAppFeatureGesuchFormElternRoutes
  //     ),
  // },
  {
    path: 'gesuch-app-feature-gesuch-form-person',
    canActivate: [hasBenutzer],
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-person').then(
        (m) => m.gesuchAppFeatureGesuchFormPersonRoutes
      ),
  },
  {
    path: 'gesuch-app-feature-gesuch-form-education',
    canActivate: [hasBenutzer],
    loadChildren: () =>
      import('@dv/gesuch-app/feature/gesuch-form-education').then(
        (m) => m.gesuchAppFeatureGesuchFormEducationRoutes
      ),
  },
];

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'gesuch-app-feature-user-select',
  },
  ...appRoutes,
  {
    path: '**',
    redirectTo: 'gesuch-app-feature-cockpit',
  },
];
