import { Route } from '@angular/router';
import {
  gesuchAppDataAccessAusbildungsstaetteEffects,
  gesuchAppDataAccessAusbildungsstaettesFeature,
} from '@dv/gesuch-app/data-access/ausbildungsstaette';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { GesuchAppFeatureGesuchFormLebenslaufComponent } from './gesuch-app-feature-gesuch-form-lebenslauf/gesuch-app-feature-gesuch-form-lebenslauf.component';

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
