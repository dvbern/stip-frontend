import { createFeature, createReducer, on } from '@ngrx/store';

import { DEFAULT_LANGUAGE, Language } from '@dv/shared/model/language';

import { SharedDataAccessLanguageActions } from './shared-data-access-language.actions';

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
      SharedDataAccessLanguageActions.resolvedDefault,
      SharedDataAccessLanguageActions.resolvedFromBrowser,
      SharedDataAccessLanguageActions.resolvedFromLocalStorage,
      SharedDataAccessLanguageActions.headerMenuSelectorChange,
      SharedDataAccessLanguageActions.footerSelectorChange,
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
