import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPatternAppHeaderComponent } from '@dv/shared/pattern/app-header';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dv-sachbearbeitung-app-pattern-gesuch-step-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SharedPatternAppHeaderComponent,
    TranslateModule,
  ],
  templateUrl:
    './sachbearbeitung-app-pattern-gesuch-step-layout.component.html',
  styleUrls: [
    './sachbearbeitung-app-pattern-gesuch-step-layout.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppPatternGesuchStepLayoutComponent {
  @Input() closeMenu: { value?: unknown } | null = null;
}
