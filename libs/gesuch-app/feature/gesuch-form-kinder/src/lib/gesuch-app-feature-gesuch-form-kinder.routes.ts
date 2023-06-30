import { Route } from '@angular/router';
import { GesuchAppFeatureGesuchFormKinderComponent } from './gesuch-app-feature-gesuch-form-kinder/gesuch-app-feature-gesuch-form-kinder.component';

export const gesuchAppFeatureGesuchFormKinderRoutes: Route[] = [
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
        title: 'gesuch-app.form.kinder.title',
        component: GesuchAppFeatureGesuchFormKinderComponent,
        data: {
          // reinitialize when navigated to the same route
          shouldReuseRoute: false,
        },
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
