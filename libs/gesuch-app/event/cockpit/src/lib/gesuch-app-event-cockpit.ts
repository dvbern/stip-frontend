import {GesuchAppModelGesuchFormStep} from '@dv/gesuch-app/model/gesuch-form';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GesuchAppEventCockpit = createActionGroup({
  source: 'Cockpit Page',
  events: {
    init: emptyProps(),
    newTriggered: props<{ periodeId: string, origin: GesuchAppModelGesuchFormStep }>(),
    removeTriggered: props<{ id: string }>(),
  },
});
