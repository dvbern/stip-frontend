import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-pattern-step-head-mobile',
  standalone: true,
  imports: [CommonModule, SharedUiProgressBarComponent, TranslateModule],
  templateUrl: './gesuch-app-pattern-step-head-mobile.component.html',
  styleUrls: ['./gesuch-app-pattern-step-head-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternStepHeadMobileComponent {}
