import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import {
  sharedDataAccessGesuchsperiodeEffects,
  sharedDataAccessGesuchsperiodesFeature,
} from '@dv/shared/data-access/gesuchsperiode';

import { GesuchAppFeatureCockpitComponent } from './gesuch-app-feature-cockpit/gesuch-app-feature-cockpit.component';

export const gesuchAppFeatureCockpitRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      provideState(sharedDataAccessGesuchsperiodesFeature),
      provideEffects(sharedDataAccessGesuchsperiodeEffects),
    ],
    children: [
      {
        path: '',
        component: GesuchAppFeatureCockpitComponent,
        title: 'gesuch-app.cockpit.title',
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
