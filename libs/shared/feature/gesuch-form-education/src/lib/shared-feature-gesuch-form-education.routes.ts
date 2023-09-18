import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import {
  gesuchAppDataAccessAusbildungsstaetteEffects,
  gesuchAppDataAccessAusbildungsstaettesFeature,
} from '@dv/shared/data-access/ausbildungsstaette';

import { SharedFeatureGesuchFormEducationComponent } from './shared-feature-gesuch-form-education/shared-feature-gesuch-form-education.component';

export const gesuchAppFeatureGesuchFormEducationRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
      provideState(gesuchAppDataAccessAusbildungsstaettesFeature),
      provideEffects(gesuchAppDataAccessAusbildungsstaetteEffects),
    ],
    children: [
      {
        path: ':id',
        title: 'shared.education.title',
        component: SharedFeatureGesuchFormEducationComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
