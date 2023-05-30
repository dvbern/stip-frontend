import { createActionGroup, emptyProps } from '@ngrx/store';

export const SharedDataAccessConfigActions = createActionGroup({
  source: 'Config',
  events: {
    appInit: emptyProps(),
  },
});
