import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SachbearbeitungAppPatternGesuchStepLayoutComponent } from '@dv/sachbearbeitung-app/pattern/gesuch-step-layout';
import { SharedUiGesuchStepWrapperComponent } from '@dv/shared/ui/gesuch-step-wrapper';
import { SharedModelGesuchFormStep } from '@dv/shared/model/gesuch-form';

@Component({
  selector: 'dv-sachbearbeitung-app-feature-gesuch-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiGesuchStepWrapperComponent,
    SachbearbeitungAppPatternGesuchStepLayoutComponent,
  ],
  templateUrl: './sachbearbeitung-app-feature-gesuch-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppFeatureGesuchFormComponent {
  step?: SharedModelGesuchFormStep;
}
