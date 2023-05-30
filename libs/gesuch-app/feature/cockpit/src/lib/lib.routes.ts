import { Route } from '@angular/router';
import { GesuchAppFeatureCockpitComponent } from './gesuch-app-feature-cockpit/gesuch-app-feature-cockpit.component';

export const gesuchAppFeatureCockpitRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
    ],
    children: [
      { path: '', component: GesuchAppFeatureCockpitComponent },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
