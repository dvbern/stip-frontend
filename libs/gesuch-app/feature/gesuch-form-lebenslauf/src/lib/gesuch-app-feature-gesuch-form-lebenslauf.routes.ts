import { Route } from '@angular/router';
import { GesuchAppFeatureGesuchFormLebenslaufComponent } from './gesuch-app-feature-gesuch-form-lebenslauf/gesuch-app-feature-gesuch-form-lebenslauf.component';

export const gesuchAppFeatureGesuchFormLebenslaufRoutes: Route[] = [
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
        component: GesuchAppFeatureGesuchFormLebenslaufComponent,
        data: {
          // reinitialize when navigated to the same route
          shouldReuseRoute: false,
        },
      },
    ],
  },
];
