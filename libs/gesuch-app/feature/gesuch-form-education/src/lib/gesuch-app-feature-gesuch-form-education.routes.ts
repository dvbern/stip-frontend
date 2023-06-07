import { Route } from '@angular/router';
import {
  gesuchAppDataAccessAusbildungsgangEffects,
  gesuchAppDataAccessAusbildungsgangsFeature,
} from '@dv/gesuch-app/data-access/ausbildungsgang';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { GesuchAppFeatureGesuchFormEducationComponent } from './gesuch-app-feature-gesuch-form-education/gesuch-app-feature-gesuch-form-education.component';

export const gesuchAppFeatureGesuchFormEducationRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      // feature specific services and other providers
      // always remove { providedIn: 'root' } from the feature specific services

      provideState(gesuchAppDataAccessAusbildungsgangsFeature),
      provideEffects(gesuchAppDataAccessAusbildungsgangEffects),
    ],
    children: [
      {
        path: ':id',
        title: 'gesuch-app.form.education.title',
        component: GesuchAppFeatureGesuchFormEducationComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
