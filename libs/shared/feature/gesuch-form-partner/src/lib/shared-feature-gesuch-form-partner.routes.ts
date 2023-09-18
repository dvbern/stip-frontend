import { Route } from '@angular/router';
import { SharedFeatureGesuchFormPartnerComponent } from './shared-feature-gesuch-form-partner/shared-feature-gesuch-form-partner.component';

export const gesuchAppFeatureGesuchFormPartnerRoutes: Route[] = [
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
        title: 'shared.partner.title',
        component: SharedFeatureGesuchFormPartnerComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
