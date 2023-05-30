import { createActionGroup, props } from '@ngrx/store';

export const <%= classify(projectName) %>ApiActions = createActionGroup({
  source: '<%= classify(name) %> API',
  events: {
    // TODO interface should come from a model lib
    <%= camelize(name) %>sLoadedSuccess: props<{ <%= camelize(name) %>s: any[] }>(),
    <%= camelize(name) %>sLoadedFailure: props<{ error: string }>(),
  },
});