import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import {
  SharedDataAccessGlobalNotificationEvents,
  selectSharedDataAccessGlobalNotificationsView,
} from '@dv/shared/data-access/global-notification';
import { SharedModelGlobalNotification } from '@dv/shared/model/global-notification';

import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'dv-global-notifications',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './global-notifications.component.html',
  styleUrls: ['./global-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalNotificationsComponent {
  private store = inject(Store);
  globalNotificationsSig = this.store.selectSignal(
    selectSharedDataAccessGlobalNotificationsView
  );

  hideNotification(notification: SharedModelGlobalNotification): void {
    this.store.dispatch(
      SharedDataAccessGlobalNotificationEvents.hideNotificationTriggered({
        notificationId: notification.id,
      })
    );
  }

  trackByIndex(index: number): number {
    return index;
  }
}
