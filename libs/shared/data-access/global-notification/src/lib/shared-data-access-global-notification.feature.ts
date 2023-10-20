import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

import { SharedDataAccessGlobalNotificationEvents } from './shared-data-access-global-notification.events';

export interface State {
  nextErrorId: number;
  globalNotifications: Record<number, SharedModelError>;
}

const initialState: State = {
  nextErrorId: 1,
  globalNotifications: [],
};

export const sharedDataAccessGlobalNotificationsFeature = createFeature({
  name: 'globalNotifications',
  reducer: createReducer(
    initialState,

    on(
      SharedDataAccessGlobalNotificationEvents.httpRequestFailed,
      (state, { errors }): State => ({
        ...state,
        nextErrorId: state.nextErrorId + 1 + errors.length,
        globalNotifications: {
          ...state.globalNotifications,
          ...errors.reduce(
            (list, error, i) => ({ ...list, [state.nextErrorId + i]: error }),
            {}
          ),
        },
      })
    ),

    on(
      SharedDataAccessGlobalNotificationEvents.hideNotificationTriggered,
      (state, { notificationId }): State => {
        const globalNotifications = { ...state.globalNotifications };
        delete globalNotifications[notificationId];

        return {
          ...state,
          globalNotifications,
        };
      }
    )
  ),
});

export const {
  name,
  reducer,
  selectGlobalNotificationsState,
  selectGlobalNotifications,
} = sharedDataAccessGlobalNotificationsFeature;
