import { Route } from '@angular/router';
import { GesuchAppFeatureGesuchFormAuszahlungenComponent } from './gesuch-app-feature-gesuch-form-auszahlungen/gesuch-app-feature-gesuch-form-auszahlungen.component';

export const gesuchAppFeatureGesuchFormAuszahlungenRoutes: Route[] = [
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
        component: GesuchAppFeatureGesuchFormAuszahlungenComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
