import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { Language, SUPPORTED_LANGUAGES } from '@dv/shared/model/language';

export const DV_LS_LANGUAGE_KEY = 'dv-language';

@Injectable({ providedIn: 'root' })
export class SharedDataAccessLanguageService {
  private document = inject(DOCUMENT);

  getLanguageFromLocalStorage(): Language | undefined {
    const languageRaw = localStorage.getItem(DV_LS_LANGUAGE_KEY);
    return languageRaw ? (languageRaw as Language) : undefined;
  }

  setLanguageIntoLocalStorage(language: Language): void {
    localStorage.setItem(DV_LS_LANGUAGE_KEY, language);
  }

  getLanguageFromBrowser(): Language | undefined {
    const languageRaw = this.document?.defaultView?.navigator?.language;
    if (languageRaw) {
      const parsedLanguage = languageRaw.split('-')[0] as Language;
      if (SUPPORTED_LANGUAGES.includes(parsedLanguage)) {
        return parsedLanguage;
      }
    }
    return undefined;
  }
}
