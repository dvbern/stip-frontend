import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GesuchAppPatternGesuchStepNavComponent } from '@dv/gesuch-app/pattern/gesuch-step-nav';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-layout',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepNavComponent,
    SharedUiProgressBarComponent,
    TranslateModule,
  ],
  templateUrl: './gesuch-app-pattern-gesuch-step-layout.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepLayoutComponent {
  @Input()
  currentStepNumber = 0; // TODO from store?

  @Input()
  maxStepNumber = 0; // TODO from store?

  @Input()
  currentStepTitle = '';

  @Input()
  nextStepSubtitle = '';

  @Input()
  stepIconSymbolName?: string;
}
