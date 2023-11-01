import { Route } from '@angular/router';
import { GesuchFormSteps } from '@dv/shared/model/gesuch-form';

export const gesuchAppFeatureGesuchFormRoutes: Route[] = [
  {
    path: GesuchFormSteps.KINDER.route,
    resolve: {
      step: () => GesuchFormSteps.KINDER,
    },
    title: 'shared.kinder.title',
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
    title: 'shared.lebenslauf.title',
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
    title: 'shared.geschwister.title',
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
    title: 'shared.auszahlung.title',
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
    title: 'shared.familiensituation.title',
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
    title: 'shared.partner.title',
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
    title: 'shared.eltern.title',
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
    title: 'shared.person.title',
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
    title: 'shared.education.title',
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
    title: 'shared.einnahmenkosten.title',
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-einnahmenkosten').then(
        (m) => m.gesuchAppFeatureGesuchFormEinnahmenkostenRoutes
      ),
  },
];
