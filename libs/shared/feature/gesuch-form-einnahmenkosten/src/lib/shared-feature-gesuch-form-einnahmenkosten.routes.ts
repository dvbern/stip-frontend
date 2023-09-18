import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import {
  gesuchAppDataAccessAusbildungsstaetteEffects,
  gesuchAppDataAccessAusbildungsstaettesFeature,
} from '@dv/shared/data-access/ausbildungsstaette';

import { SharedFeatureGesuchFormEinnahmenkostenComponent } from './shared-feature-gesuch-form-einnahmenkosten/shared-feature-gesuch-form-einnahmenkosten.component';

export const gesuchAppFeatureGesuchFormEinnahmenkostenRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      provideState(gesuchAppDataAccessAusbildungsstaettesFeature),
      provideEffects(gesuchAppDataAccessAusbildungsstaetteEffects),
    ],
    children: [
      {
        path: ':id',
        title: 'shared.education.title',
        component: SharedFeatureGesuchFormEinnahmenkostenComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
