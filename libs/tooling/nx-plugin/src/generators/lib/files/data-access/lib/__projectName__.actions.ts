import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const <%= classify(projectName) %>Actions = createActionGroup({
  // actions belong to the source, eg UserPage, OrderEditor, Toolbar, ...
  // actions describe event eg "UserPage Init", "UserPage Editor Save"
  // actions DO NOT belong to the destination, eg "User Api Load Users
  source: '<replace-me>',
  events: {
    // eg page initialized (trigger loading of data, ...)
    init: emptyProps(),

    // defining an event with payload using the `props` function
    paginationChanged: props<{ page: number; offset: number }>(),
  },
});
