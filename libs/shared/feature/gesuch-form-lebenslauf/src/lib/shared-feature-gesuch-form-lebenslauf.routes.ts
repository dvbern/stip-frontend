import { Route } from '@angular/router';
import {
  gesuchAppDataAccessAusbildungsstaetteEffects,
  gesuchAppDataAccessAusbildungsstaettesFeature,
} from '@dv/shared/data-access/ausbildungsstaette';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SharedFeatureGesuchFormLebenslaufComponent } from './shared-feature-gesuch-form-lebenslauf/shared-feature-gesuch-form-lebenslauf.component';

export const gesuchAppFeatureGesuchFormLebenslaufRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // ausbildungsstaette needed for the planned ausbildung at the bottom of lebenslauf
      provideState(gesuchAppDataAccessAusbildungsstaettesFeature),
      provideEffects(gesuchAppDataAccessAusbildungsstaetteEffects),
    ],
    children: [
      {
        path: ':id',
        title: 'shared.geschwister.title',
        component: SharedFeatureGesuchFormLebenslaufComponent,
        data: {
          // reinitialize when navigated to the same route
          shouldReuseRoute: false,
        },
      },
    ],
  },
];
