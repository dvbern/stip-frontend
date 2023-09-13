import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { SharedUiGesuchStepWrapperComponent } from '@dv/shared/ui/gesuch-step-wrapper';
import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    SharedUiGesuchStepWrapperComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormComponent {
  step?: SharedModelGesuchFormStep;
}
