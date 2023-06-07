import { Route } from '@angular/router';
import { GesuchAppFeatureGesuchFormFamiliensituationComponent } from './gesuch-app-feature-gesuch-form-familiensituation/gesuch-app-feature-gesuch-form-familiensituation.component';
import {
  GesuchFormFamiliensituationMetadataService
} from './gesuch-app-feature-gesuch-form-familiensituation/gesuch-app-feature-gesuch-form-familiensituation.service.ts/gesuch-form-familiensituation-metadata.service';

export const gesuchAppFeatureGesuchFormFamiliensituationRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      GesuchFormFamiliensituationMetadataService
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
    ],
    children: [
      {
        path: ':id',
        component: GesuchAppFeatureGesuchFormFamiliensituationComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
