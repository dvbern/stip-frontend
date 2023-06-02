import { createFeature, createReducer, on } from '@ngrx/store';

import { DEFAULT_LANGUAGE, Language } from '@dv/shared/model/language';

import { SharedDataAccessLanguageEvents } from './shared-data-access-language.events';

export interface State {
  language: Language;
}

const initialState: State = {
  language: DEFAULT_LANGUAGE,
};

export const sharedDataAccessLanguageFeature = createFeature({
  name: 'language',
  reducer: createReducer(
    initialState,

    on(
      SharedDataAccessLanguageEvents.resolvedDefault,
      SharedDataAccessLanguageEvents.resolvedFromBrowser,
      SharedDataAccessLanguageEvents.resolvedFromLocalStorage,
      SharedDataAccessLanguageEvents.headerMenuSelectorChange,
      SharedDataAccessLanguageEvents.footerSelectorChange,
      (state, { language }): State => ({ ...state, language })
    )
  ),
});

export const {
  name, // feature name
  reducer,
  selectLanguageState,
  selectLanguage,
} = sharedDataAccessLanguageFeature;
