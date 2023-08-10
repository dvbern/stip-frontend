import { Injectable, inject, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Land } from '@dv/shared/model/gesuch';
import { TranslateService } from '@ngx-translate/core';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilCountriesService {
  private translate = inject(TranslateService);
  private translatedLaender$ = this.translate.onLangChange
    .pipe(
      startWith({
        translations: this.translate.translations[this.translate.currentLang],
      })
    )
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  public getCountryList(laender: Land[]) {
    console.log('Laender', laender);
    return this.translatedLaender$.pipe(
      map(({ translations }) => {
        const translated = laender
          .filter((code) => translations[`shared.country.${code}`])
          .map((code) => ({
            code,
            text: translations[`shared.country.${code}`],
          }));
        translated.sort(({ text: a }, { text: b }) =>
          a.localeCompare(b, this.translate.currentLang, {
            ignorePunctuation: true,
          })
        );
        return [
          { code: 'CH', text: translations['shared.country.CH'] },
          ...translated,
        ];
      })
    );
  }
}
