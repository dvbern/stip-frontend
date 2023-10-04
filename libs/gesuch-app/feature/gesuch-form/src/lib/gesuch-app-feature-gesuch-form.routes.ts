import { Route } from '@angular/router';
import {
  AUSBILDUNG,
  AUSZAHLUNGEN,
  EINNAHMEN_KOSTEN,
  ELTERN,
  FAMILIENSITUATION,
  GESCHWISTER,
  KINDER,
  LEBENSLAUF,
  PARTNER,
  PERSON,
} from '@dv/shared/model/gesuch-form';

export const gesuchAppFeatureGesuchFormRoutes: Route[] = [
  {
    path: KINDER.route,
    resolve: {
      step: () => KINDER,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-kinder').then(
        (m) => m.gesuchAppFeatureGesuchFormKinderRoutes
      ),
  },
  {
    path: LEBENSLAUF.route,
    resolve: {
      step: () => LEBENSLAUF,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-lebenslauf').then(
        (m) => m.gesuchAppFeatureGesuchFormLebenslaufRoutes
      ),
  },
  {
    path: GESCHWISTER.route,
    resolve: {
      step: () => GESCHWISTER,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-geschwister').then(
        (m) => m.gesuchAppFeatureGesuchFormGeschwisterRoutes
      ),
  },
  {
    path: AUSZAHLUNGEN.route,
    resolve: {
      step: () => AUSZAHLUNGEN,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-auszahlungen').then(
        (m) => m.gesuchAppFeatureGesuchFormAuszahlungenRoutes
      ),
  },
  {
    path: FAMILIENSITUATION.route,
    resolve: {
      step: () => FAMILIENSITUATION,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-familiensituation').then(
        (m) => m.gesuchAppFeatureGesuchFormFamiliensituationRoutes
      ),
  },
  {
    path: PARTNER.route,
    resolve: {
      step: () => PARTNER,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-partner').then(
        (m) => m.gesuchAppFeatureGesuchFormPartnerRoutes
      ),
  },
  {
    path: ELTERN.route,
    resolve: {
      step: () => ELTERN,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-eltern').then(
        (m) => m.gesuchAppFeatureGesuchFormElternRoutes
      ),
  },
  {
    path: PERSON.route,
    resolve: {
      step: () => PERSON,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-person').then(
        (m) => m.gesuchAppFeatureGesuchFormPersonRoutes
      ),
  },
  {
    path: AUSBILDUNG.route,
    resolve: {
      step: () => AUSBILDUNG,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-education').then(
        (m) => m.gesuchAppFeatureGesuchFormEducationRoutes
      ),
  },
  {
    path: EINNAHMEN_KOSTEN.route,
    resolve: {
      step: () => EINNAHMEN_KOSTEN,
    },
    loadChildren: () =>
      import('@dv/shared/feature/gesuch-form-einnahmenkosten').then(
        (m) => m.gesuchAppFeatureGesuchFormEinnahmenkostenRoutes
      ),
  },
];
