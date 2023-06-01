import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppDataAccessGesuchsperiodeCockpitActions =
  createActionGroup({
    // actions belong to the source, eg UserPage, OrderEditor, Toolbar, ...
    // actions describe event eg "UserPage Init", "UserPage Editor Save"
    // actions DO NOT belong to the destination, eg "User Api Load Users
    source: 'Cockpit Page GP',
    events: {
      // eg page initialized (trigger loading of data, ...)
      init: emptyProps(),
    },
  });
