import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SharedPatternAppHeaderComponent } from '@dv/shared/pattern/app-header';
import { GlobalNotificationsComponent } from '@dv/shared/pattern/global-notification';

@Component({
  selector: 'dv-gesuch-app-pattern-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    SharedPatternAppHeaderComponent,
    GlobalNotificationsComponent,
  ],
  templateUrl: './gesuch-app-pattern-main-layout.component.html',
  styleUrls: ['./gesuch-app-pattern-main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternMainLayoutComponent {
  @Input() closeMenu: { value?: unknown } | null = null;
}
