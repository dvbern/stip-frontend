import { Route } from '@angular/router';
import { GesuchAppFeatureGesuchFormAbschlussComponent } from './gesuch-app-feature-gesuch-form-abschluss/gesuch-app-feature-gesuch-form-abschluss.component';

export const gesuchAppFeatureGesuchFormAbschlussRoutes: Route[] = [
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
        title: 'shared.abschluss.title',
        component: GesuchAppFeatureGesuchFormAbschlussComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
