import { Injectable, inject } from '@angular/core';
import { Land } from '@dv/shared/model/gesuch';
import { TranslateService } from '@ngx-translate/core';
import { map, shareReplay, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilCountriesService {
  private translate = inject(TranslateService);
  private translatedLaender$ = this.translate.onLangChange
    .pipe(
      startWith({
        translations:
          this.translate.translations[
            this.translate.currentLang ?? this.translate.defaultLang
          ],
      })
    )
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  public getCountryList(laender: Land[]) {
    return this.translatedLaender$.pipe(
      map(({ translations }) => {
        if (!laender) {
          return [];
        }
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
