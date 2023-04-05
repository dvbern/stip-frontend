import {bootstrapApplication} from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {AppComponent} from './app/app.component';
import {appRoutes} from './app/app.routes';
import {importProvidersFrom} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {BenutzerState} from "../../../libs/stip-lib/src/lib/store/state/benutzer.state";
import {HttpClientModule} from "@angular/common/http";
import {BASE_PATH} from "../../../libs/stip-models/src/lib/generated";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(NgxsModule.forRoot([BenutzerState])),
    importProvidersFrom(HttpClientModule),
    {provide: BASE_PATH, useValue: ''}
  ],
}).catch((err) => console.error(err));
