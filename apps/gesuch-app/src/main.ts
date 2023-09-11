import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// TODO: cleanup, used to build affected +1
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
