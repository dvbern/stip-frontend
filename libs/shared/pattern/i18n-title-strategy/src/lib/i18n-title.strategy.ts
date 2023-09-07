import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { effect, inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import { withLatestFrom } from 'rxjs';

const { selectTitle, selectUrl } = getRouterSelectors();

const APP_NAME_I18N_KEY = 'app-name';

@Injectable()
export class SharedPatternI18nTitleStrategy extends TitleStrategy {
  private title = inject(Title);
  private translateService = inject(TranslateService);
  private store = inject(Store);

  constructor() {
    super();

    // update current  title on language change
    const langChangeWithTitleAndUrl$ = this.translateService.onLangChange.pipe(
      withLatestFrom(
        this.store.select(selectTitle),
        this.store.select(selectUrl)
      )
    );
    const langChangeWithTitleAndUrl = toSignal(langChangeWithTitleAndUrl$);
    effect(() => {
      const [, title, url] = langChangeWithTitleAndUrl() ?? [];
      if (url && !title) {
        this.missingTranslationKey(url);
      }
      if (url !== undefined && title !== undefined) {
        this.updateTitleInternal(title, url);
      }
    });
  }

  // update title on navigation
  updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    this.updateTitleInternal(title, routerState.url);
  }

  private updateTitleInternal(title: string | undefined, url: string) {
    if (title !== undefined) {
      const routeTitleTranslation = this.translateService.instant(title);
      const appNameTranslation =
        this.translateService.instant(APP_NAME_I18N_KEY);
      this.title.setTitle(`${routeTitleTranslation} - ${appNameTranslation}`);
    } else {
      this.missingTranslationKey(url);
    }
  }

  private missingTranslationKey(url: string) {
    console.error(
      `[${SharedPatternI18nTitleStrategy.name}]`,
      `The title translation key for route "${url}" is not defined, please add it to the corresponding route config.`
    );
  }
}

export function provideSharedPatternI18nTitleStrategy() {
  return [
    {
      provide: TitleStrategy,
      useClass: SharedPatternI18nTitleStrategy,
    },
  ];
}
