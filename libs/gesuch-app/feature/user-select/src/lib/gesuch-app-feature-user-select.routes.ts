import { Route, Router } from '@angular/router';
import { GesuchAppFeatureUserSelectComponent } from './gesuch-app-feature-user-select/gesuch-app-feature-user-select.component';
import { inject } from '@angular/core';

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
        canActivate: [
          () => {
            const router = inject(Router);
            return !localStorage.getItem('userId')
              ? true
              : router.navigate(['/gesuch-app-feature-cockpit']);
          },
        ],
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
