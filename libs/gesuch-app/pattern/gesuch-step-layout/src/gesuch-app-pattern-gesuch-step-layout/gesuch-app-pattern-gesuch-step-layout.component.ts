import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GesuchAppPatternGesuchStepNavComponent } from '@dv/gesuch-app/pattern/gesuch-step-nav';
import { GesuchAppPatternMainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
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
    SharedUiIconChipComponent,
    GesuchAppPatternMainLayoutComponent,
    RouterLink,
  ],
  templateUrl: './gesuch-app-pattern-gesuch-step-layout.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepLayoutComponent {
  @Input({ required: true })
  currentStepNumber!: number; // TODO from store?

  @Input({ required: true })
  maxStepNumber!: number; // TODO from store?

  @Input({ required: true })
  currentStepTitle!: string;

  @Input({ required: true })
  nextStepSubtitle!: string;

  @Input({ required: true })
  stepIconSymbolName!: string;
}
