import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';

import { DEFAULT_LANGUAGE } from '@dv/shared/model/language';

import { SharedDataAccessLanguageService } from './shared-data-access-language.service';
import { SharedDataAccessLanguageActions } from './shared-data-access-language.actions';

export const resolveLanguageOnInit = createEffect(
  (
    actions$ = inject(Actions),
    languageService = inject(SharedDataAccessLanguageService)
  ) => {
    return actions$.pipe(
      ofType(SharedDataAccessLanguageActions.appInit),
      map(() => {
        const languageFromLocalStorage =
          languageService.getLanguageFromLocalStorage();
        if (languageFromLocalStorage) {
          return SharedDataAccessLanguageActions.resolvedFromLocalStorage({
            language: languageFromLocalStorage,
          });
        }
        const languageFromBrowser = languageService.getLanguageFromBrowser();
        if (languageFromBrowser) {
          return SharedDataAccessLanguageActions.resolvedFromBrowser({
            language: languageFromBrowser,
          });
        }
        return SharedDataAccessLanguageActions.resolvedDefault({
          language: DEFAULT_LANGUAGE,
        });
      })
    );
  },
  { functional: true }
);

export const syncLanguageToNgxTranslate = createEffect(
  (
    actions$ = inject(Actions),
    ngxTranslateService = inject(TranslateService)
  ) => {
    return actions$.pipe(
      ofType(
        SharedDataAccessLanguageActions.resolvedDefault,
        SharedDataAccessLanguageActions.resolvedFromBrowser,
        SharedDataAccessLanguageActions.resolvedFromLocalStorage,
        SharedDataAccessLanguageActions.headerMenuSelectorChange,
        SharedDataAccessLanguageActions.footerSelectorChange
      ),
      tap(({ language }) => {
        ngxTranslateService.use(language);
      }),
      switchMap(({ language }) =>
        ngxTranslateService.getTranslation(`shared.${language}`).pipe(
          map((sharedTranslationsForLanguage) => ({
            language,
            sharedTranslationsForLanguage,
          })),
          catchError(() => {
            console.error(`Shared translations for "${language}" not found`);
            return EMPTY;
          })
        )
      ),
      tap(({ language, sharedTranslationsForLanguage }) => {
        ngxTranslateService.setTranslation(
          language,
          sharedTranslationsForLanguage,
          true
        );
      })
    );
  },
  { functional: true, dispatch: false }
);

// add effects here
export const sharedDataAccessLanguageEffects = {
  resolveLanguageOnInit,
  syncLanguageToNgxTranslate,
};
