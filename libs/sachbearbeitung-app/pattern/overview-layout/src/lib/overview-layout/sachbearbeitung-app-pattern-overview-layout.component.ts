import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPatternAppHeaderComponent } from '@dv/shared/pattern/app-header';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dv-sachbearbeitung-app-pattern-overview-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SharedPatternAppHeaderComponent,
    TranslateModule,
  ],
  templateUrl: './sachbearbeitung-app-pattern-overview-layout.component.html',
  styleUrls: ['./sachbearbeitung-app-pattern-overview-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppPatternOverviewLayoutComponent {
  @Input() closeMenu: { value?: unknown } | null = null;
}
