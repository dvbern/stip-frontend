import { TestScheduler } from 'rxjs/testing';

import { resolveLanguageOnInit } from './shared-data-access-language.effects';
import { SharedDataAccessLanguageService } from './shared-data-access-language.service';
import { SharedDataAccessLanguageActions } from './shared-data-access-language.actions';

describe('SharedDataAccessLanguage Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('resolves to default language if both browser and local storage languages are not available', () => {
    const sharedDataAccessTranslationServiceMock = {
      getLanguageFromLocalStorage: () => undefined,
      getLanguageFromBrowser: () => undefined,
    } as SharedDataAccessLanguageService;

    scheduler.run(({ expectObservable, hot }) => {
      const actionsMock$ = hot('a', {
        a: SharedDataAccessLanguageActions.appInit(),
      });

      const effectStream$ = resolveLanguageOnInit(
        actionsMock$,
        sharedDataAccessTranslationServiceMock
      );
      expectObservable(effectStream$).toBe('a', {
        a: SharedDataAccessLanguageActions.resolvedDefault({
          language: 'de',
        }),
      });
    });
  });

  it('resolves to language from browser if langauge from local storage is not available', () => {
    const sharedDataAccessTranslationServiceMock = {
      getLanguageFromLocalStorage: () => undefined,
      getLanguageFromBrowser: () => 'fr',
    } as SharedDataAccessLanguageService;

    scheduler.run(({ expectObservable, hot }) => {
      const actionsMock$ = hot('a', {
        a: SharedDataAccessLanguageActions.appInit(),
      });

      const effectStream$ = resolveLanguageOnInit(
        actionsMock$,
        sharedDataAccessTranslationServiceMock
      );
      expectObservable(effectStream$).toBe('a', {
        a: SharedDataAccessLanguageActions.resolvedFromBrowser({
          language: 'fr',
        }),
      });
    });
  });

  it('resolves to language from local storage if available', () => {
    const sharedDataAccessTranslationServiceMock = {
      getLanguageFromLocalStorage: () => 'it',
      getLanguageFromBrowser: () => 'fr',
    } as SharedDataAccessLanguageService;

    scheduler.run(({ expectObservable, hot }) => {
      const actionsMock$ = hot('a', {
        a: SharedDataAccessLanguageActions.appInit(),
      });

      const effectStream$ = resolveLanguageOnInit(
        actionsMock$,
        sharedDataAccessTranslationServiceMock
      );
      expectObservable(effectStream$).toBe('a', {
        a: SharedDataAccessLanguageActions.resolvedFromLocalStorage({
          language: 'it',
        }),
      });
    });
  });
});
