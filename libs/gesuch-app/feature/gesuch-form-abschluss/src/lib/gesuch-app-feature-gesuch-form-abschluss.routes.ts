import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import {
  gesuchAppDataAccessAbschlussEffects,
  gesuchAppDataAccessAbschlussFeature,
} from '@dv/gesuch-app/data-access/abschluss';

import { GesuchAppFeatureGesuchFormAbschlussComponent } from './gesuch-app-feature-gesuch-form-abschluss/gesuch-app-feature-gesuch-form-abschluss.component';

export const gesuchAppFeatureGesuchFormAbschlussRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services
      provideState(gesuchAppDataAccessAbschlussFeature),
      provideEffects(gesuchAppDataAccessAbschlussEffects),
    ],
    children: [
      {
        path: ':id',
        title: 'shared.abschluss.title',
        component: GesuchAppFeatureGesuchFormAbschlussComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
