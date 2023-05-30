import {
  ENVIRONMENT_INITIALIZER,
  importProvidersFrom,
  inject,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  Route,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  SharedDataAccessConfigActions,
  sharedDataAccessConfigEffects,
  sharedDataAccessConfigsFeature,
} from '@dv/shared/data-access/config';
import { SharedPatternInterceptorDeploymentConfig } from '@dv/shared/pattern/interceptor-deployment-config';
import {
  SharedDataAccessLanguageActions,
  sharedDataAccessLanguageEffects,
  sharedDataAccessLanguageFeature,
} from '@dv/shared/data-access/language';
import { provideSharedPatternI18nTitleStrategy } from '@dv/shared/pattern/i18n-title-strategy';
import { provideSharedPatternNgbDatepickerAdapter } from '@dv/shared/pattern/ngb-datepicker-adapter';

export class ExplicitMissingTranslationHandler
  implements MissingTranslationHandler
{
  handle(params: MissingTranslationHandlerParams) {
    return `⚠️ ${params.key}`;
  }
}

export function provideSharedPatternCore(appRoutes: Route[]) {
  return [
    // providers
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      })
    ),
    provideHttpClient(
      withInterceptors([
        SharedPatternInterceptorDeploymentConfig,
        // STUB add global interceptors for auth, error handling, ...
      ])
    ),
    provideSharedPatternI18nTitleStrategy(),
    provideSharedPatternNgbDatepickerAdapter(),

    // state management
    provideStore(
      {
        router: routerReducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    provideState(sharedDataAccessConfigsFeature),
    provideState(sharedDataAccessLanguageFeature),
    provideEffects(
      sharedDataAccessConfigEffects,
      sharedDataAccessLanguageEffects
    ),
    provideRouterStore(),
    ...(isDevMode() ? [provideStoreDevtools({})] : []),

    // modules which don't support Angular Standalone APIs yet
    importProvidersFrom([
      TranslateModule.forRoot({
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: ExplicitMissingTranslationHandler,
        },
        useDefaultLang: false, // easier to notice missing translations
        loader: {
          provide: TranslateLoader,
          useFactory: () =>
            new TranslateHttpLoader(
              inject(HttpClient),
              './assets/i18n/',
              '.json'
            ),
        },
      }),
    ]),

    // init (has to be last, order matters)
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        const store = inject(Store);
        // rework to ngrxOnEffectsInit once available for functional effects
        // https://twitter.com/MarkoStDev/status/1661094873116581901
        store.dispatch(SharedDataAccessConfigActions.appInit());
        store.dispatch(SharedDataAccessLanguageActions.appInit());
      },
    },
  ];
}
