import { Route } from '@angular/router';
import { SharedFeatureGesuchFormFamiliensituationComponent } from './shared-feature-gesuch-form-familiensituation/shared-feature-gesuch-form-familiensituation.component';

export const gesuchAppFeatureGesuchFormFamiliensituationRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
    ],
    children: [
      {
        path: ':id',
        component: SharedFeatureGesuchFormFamiliensituationComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
