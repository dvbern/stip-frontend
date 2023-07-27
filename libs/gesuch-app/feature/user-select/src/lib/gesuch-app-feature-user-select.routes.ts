import { Route } from '@angular/router';

import { GesuchAppFeatureUserSelectComponent } from './gesuch-app-feature-user-select/gesuch-app-feature-user-select.component';

export const gesuchAppFeatureUserSelectRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
    ],
    children: [
      {
        path: '',
        component: GesuchAppFeatureUserSelectComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
