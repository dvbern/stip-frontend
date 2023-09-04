import { Route } from '@angular/router';
import { SharedFeatureGesuchFormGeschwisterComponent } from './gesuch-app-feature-gesuch-form-geschwister/gesuch-app-feature-gesuch-form-geschwister.component';

export const gesuchAppFeatureGesuchFormGeschwisterRoutes: Route[] = [
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
        title: 'gesuch-app.form.geschwister.title',
        component: SharedFeatureGesuchFormGeschwisterComponent,
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
