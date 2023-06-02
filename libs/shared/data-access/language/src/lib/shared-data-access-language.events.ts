import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Language } from '@dv/shared/model/language';

export const SharedDataAccessLanguageEvents = createActionGroup({
  source: 'Language',
  events: {
    appInit: emptyProps(),

    resolvedFromBrowser: props<{ language: Language }>(),
    resolvedFromLocalStorage: props<{ language: Language }>(),
    resolvedDefault: props<{ language: Language }>(),

    // create actions per event source, they are cheap (better overview of what is happening)
    headerMenuSelectorChange: props<{ language: Language }>(),
    footerSelectorChange: props<{ language: Language }>(),
  },
});
