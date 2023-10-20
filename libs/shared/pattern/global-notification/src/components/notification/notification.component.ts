import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
} from '@angular/core';
import { SharedModelGlobalNotification } from '@dv/shared/model/global-notification';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

type Severity = 'SEVERE' | 'ERROR';

@Component({
  selector: 'dv-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbToast],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  @Input({ required: true }) notification!: SharedModelGlobalNotification;
  @Input() showPath = true;
  @Input() isToast = false;

  @Output() closeTriggered = new EventEmitter<void>();

  dateNow = new Date();
  severity = computed(() => {
    const severity: Record<
      SharedModelGlobalNotification['content']['type'],
      Severity
    > = {
      unknownError: 'SEVERE',
      unknownHttpError: 'ERROR',
      validationError: 'ERROR',
    };

    return severity[this.notification.content.type];
  });
  showTimestamp = computed(() => {
    return this.notification.content.type !== 'validationError';
  });
}
