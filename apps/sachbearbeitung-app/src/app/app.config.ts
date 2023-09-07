import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideSharedPatternCore } from '@dv/shared/pattern/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideSharedPatternCore(routes), provideAnimations()],
};
