import { selectSharedDataAccessGlobalNotificationsView } from './shared-data-access-global-notification.selectors';

describe('selectSharedDataAccessGlobalNotificationsView', () => {
  it('selects view', () => {
    const state = {
      nextErrorId: 0,
      globalNotifications: {},
      notificationList: [],
    };
    const result =
      selectSharedDataAccessGlobalNotificationsView.projector(state);
    expect(result).toEqual(state);
  });
});
