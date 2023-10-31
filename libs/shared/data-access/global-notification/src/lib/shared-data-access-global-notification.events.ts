import { createActionGroup, props } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

export const SharedDataAccessGlobalNotificationEvents = createActionGroup({
  source: 'GlobalNotification',
  events: {
    httpRequestFailed: props<{ errors: SharedModelError[] }>(),
    hideNotificationTriggered: props<{ notificationId: number }>(),
  },
});
