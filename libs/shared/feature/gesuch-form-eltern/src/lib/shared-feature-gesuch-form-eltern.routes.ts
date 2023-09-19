import { Route } from '@angular/router';

import { SharedFeatureGesuchFormElternComponent } from './shared-feature-gesuch-form-eltern/shared-feature-gesuch-form-eltern.component';
import { SharedFeatureGesuchFormElternEditorComponent } from './shared-feature-gesuch-form-eltern-editor/shared-feature-gesuch-form-eltern-editor.component';

export const gesuchAppFeatureGesuchFormElternRoutes: Route[] = [
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
        title: 'shared.eltern.title',
        component: SharedFeatureGesuchFormElternComponent,
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
