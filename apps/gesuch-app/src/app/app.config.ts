import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { provideSharedPatternCore } from '@dv/shared/pattern/core';
import {
  gesuchAppDataAccessGesuchEffects,
  gesuchAppDataAccessGesuchsFeature,
} from '@dv/shared/data-access/gesuch';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSharedPatternCore(routes),
    provideState(gesuchAppDataAccessGesuchsFeature),
    provideEffects(gesuchAppDataAccessGesuchEffects),
    provideAnimations(),
  ],
};
