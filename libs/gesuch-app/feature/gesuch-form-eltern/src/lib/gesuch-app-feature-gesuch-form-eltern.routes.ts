import { Route } from '@angular/router';
import { GesuchAppFeatureGesuchFormElternComponent } from './gesuch-app-feature-gesuch-form-eltern/gesuch-app-feature-gesuch-form-eltern.component';
import { provideState } from '@ngrx/store';
import {
  gesuchAppDataAccessElternEffects,
  gesuchAppDataAccessElternsFeature,
} from '@dv/gesuch-app/data-access/eltern';
import { provideEffects } from '@ngrx/effects';

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
        title: 'gesuch-app.form.eltern.title',
        component: GesuchAppFeatureGesuchFormElternComponent,
      },
      // add more routes here (siblings)
      // it is also possible to add nested routes as children
      // of this feature root component (or even lazy loaded sub features)
    ],
  },
];
