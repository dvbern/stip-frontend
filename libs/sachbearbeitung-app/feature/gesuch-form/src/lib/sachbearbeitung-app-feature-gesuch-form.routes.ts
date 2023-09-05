import { Route } from '@angular/router';
import { SachbearbeitungAppFeatureGesuchFormComponent } from './sachbearbeitung-app-feature-gesuch-form/sachbearbeitung-app-feature-gesuch-form.component';

export const sachbearbeitungAppFeatureGesuchFormRoutes: Route[] = [
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
        component: SachbearbeitungAppFeatureGesuchFormComponent,
        title: 'sachbearbeitung-app.gesuch-form.title',
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
