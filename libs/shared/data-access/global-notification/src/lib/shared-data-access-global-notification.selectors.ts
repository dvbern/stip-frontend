import { createSelector } from '@ngrx/store';
import { sharedDataAccessGlobalNotificationsFeature } from './shared-data-access-global-notification.feature';
import { SharedModelGlobalNotification } from '@dv/shared/model/global-notification';

export const selectSharedDataAccessGlobalNotificationsView = createSelector(
  sharedDataAccessGlobalNotificationsFeature.selectGlobalNotificationsState,
  (state) => ({
    ...state,
    notificationList: Object.entries(
      state.globalNotificationsById
    ).map<SharedModelGlobalNotification>(([id, error]) => ({
      id: +id,
      autohide: false,
      content: error,
      message: error.message,
      messageKey: error.messageKey,
    })),
  })
);
