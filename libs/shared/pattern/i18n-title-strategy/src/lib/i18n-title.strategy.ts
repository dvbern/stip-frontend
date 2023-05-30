import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import { filter, Subject, takeUntil, withLatestFrom } from 'rxjs';

const { selectTitle, selectUrl } = getRouterSelectors();

const APP_NAME_I18N_KEY = 'gesuch-app.name';

@Injectable()
export class SharedPatternI18nTitleStrategy
  extends TitleStrategy
  implements OnDestroy
{
  private title = inject(Title);
  private translateService = inject(TranslateService);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  constructor() {
    super();

    // update current  title on language change
    this.translateService.onLangChange
      .pipe(
        withLatestFrom(
          this.store.select(selectTitle),
          this.store.select(selectUrl)
        ),
        filter(([, , url]) => url !== undefined),
        takeUntil(this.destroy$)
      )
      .subscribe(([, title, url]) => {
        this.updateTitleInternal(title, url);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      console.error(
        `[${SharedPatternI18nTitleStrategy.name}]`,
        `The title translation key for route "${url}" is not defined, please add it to the corresponding route config.`
      );
    }
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
