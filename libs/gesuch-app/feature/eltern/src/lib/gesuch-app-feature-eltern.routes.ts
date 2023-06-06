import { Route } from '@angular/router';
import { GesuchAppFeatureElternComponent } from './gesuch-app-feature-eltern/gesuch-app-feature-eltern.component';

export const gesuchAppFeatureElternRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
    ],
    children: [
      { path: '', component: GesuchAppFeatureElternComponent },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
