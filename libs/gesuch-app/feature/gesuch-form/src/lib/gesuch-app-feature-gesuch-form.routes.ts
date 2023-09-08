import { Route } from '@angular/router';
import { GesuchFormSteps } from '@dv/shared/model/gesuch-form';

export const gesuchAppFeatureGesuchFormRoutes: Route[] = [
  {
    path: GesuchFormSteps.KINDER.route,
    resolve: {
      step: () => GesuchFormSteps.KINDER,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-kinder').then(
        (m) => m.gesuchAppFeatureGesuchFormKinderRoutes
      ),
  },
  {
    path: GesuchFormSteps.LEBENSLAUF.route,
    resolve: {
      step: () => GesuchFormSteps.LEBENSLAUF,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-lebenslauf').then(
        (m) => m.gesuchAppFeatureGesuchFormLebenslaufRoutes
      ),
  },
  {
    path: GesuchFormSteps.GESCHWISTER.route,
    resolve: {
      step: () => GesuchFormSteps.GESCHWISTER,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-geschwister').then(
        (m) => m.gesuchAppFeatureGesuchFormGeschwisterRoutes
      ),
  },
  {
    path: GesuchFormSteps.AUSZAHLUNGEN.route,
    resolve: {
      step: () => GesuchFormSteps.AUSZAHLUNGEN,
    },
    title: 'gesuch-app.auszahlung.title',
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-auszahlungen').then(
        (m) => m.gesuchAppFeatureGesuchFormAuszahlungenRoutes
      ),
  },
  {
    path: GesuchFormSteps.FAMILIENSITUATION.route,
    resolve: {
      step: () => GesuchFormSteps.FAMILIENSITUATION,
    },
    title: 'gesuch-app.familiensituation.title',
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-familiensituation').then(
        (m) => m.gesuchAppFeatureGesuchFormFamiliensituationRoutes
      ),
  },
  {
    path: GesuchFormSteps.PARTNER.route,
    resolve: {
      step: () => GesuchFormSteps.PARTNER,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-partner').then(
        (m) => m.gesuchAppFeatureGesuchFormPartnerRoutes
      ),
  },
  {
    path: GesuchFormSteps.ELTERN.route,
    resolve: {
      step: () => GesuchFormSteps.ELTERN,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-eltern').then(
        (m) => m.gesuchAppFeatureGesuchFormElternRoutes
      ),
  },
  {
    path: GesuchFormSteps.PERSON.route,
    resolve: {
      step: () => GesuchFormSteps.PERSON,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-person').then(
        (m) => m.gesuchAppFeatureGesuchFormPersonRoutes
      ),
  },
  {
    path: GesuchFormSteps.AUSBILDUNG.route,
    resolve: {
      step: () => GesuchFormSteps.AUSBILDUNG,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-education').then(
        (m) => m.gesuchAppFeatureGesuchFormEducationRoutes
      ),
  },
  {
    path: GesuchFormSteps.EINNAHMEN_KOSTEN.route,
    resolve: {
      step: () => GesuchFormSteps.EINNAHMEN_KOSTEN,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-einnahmenkosten').then(
        (m) => m.gesuchAppFeatureGesuchFormEinnahmenkostenRoutes
      ),
  },
];
