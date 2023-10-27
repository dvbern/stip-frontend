import { createFeature, createReducer, on } from '@ngrx/store';

import { SharedModelError } from '@dv/shared/model/error';

import { SharedDataAccessGlobalNotificationEvents } from './shared-data-access-global-notification.events';

export interface State {
  nextErrorId: number;
  globalNotificationsById: Record<number, SharedModelError>;
}

const initialState: State = {
  nextErrorId: 1,
  globalNotificationsById: [],
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
        globalNotificationsById: {
          ...state.globalNotificationsById,
          ...errors.reduce(
            (errorsById, error, i) => ({
              ...errorsById,
              [state.nextErrorId + i]: error,
            }),
            {}
          ),
        },
      })
    ),

    on(
      SharedDataAccessGlobalNotificationEvents.hideNotificationTriggered,
      (state, { notificationId }): State => {
        const globalNotifications = { ...state.globalNotificationsById };
        delete globalNotifications[notificationId];

        return {
          ...state,
          globalNotificationsById: globalNotifications,
        };
      }
    )
  ),
});

export const {
  name,
  reducer,
  selectGlobalNotificationsState,
  selectGlobalNotificationsById,
} = sharedDataAccessGlobalNotificationsFeature;
