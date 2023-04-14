import {bootstrapApplication} from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {AppComponent} from './app/app.component';
import {appRoutes} from './app/app.routes';
import {APP_INITIALIZER, importProvidersFrom} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {BenutzerState} from "../../../libs/stip-lib/src/lib/store/state/benutzer.state";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BASE_PATH} from "../../../libs/stip-models/src/lib/generated";
import {sharedStateFactory} from "./util/shared-states-factory";
import {HttpBaseInterceptor} from "../../../libs/stip-lib/src/lib/rest/HttpBaseInterceptor";
import {ConfigState} from "../../../libs/stip-lib/src/lib/store/state/config.state";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(NgxsModule.forRoot([BenutzerState, ConfigState])),
    importProvidersFrom(HttpClientModule),
    {provide: BASE_PATH, useValue: ''},
    {provide: APP_INITIALIZER, useFactory: sharedStateFactory, deps: [Store], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true},
  ],
}).catch((err) => console.error(err));
