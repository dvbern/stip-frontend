import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiGesuchStepWrapperComponent } from '@dv/shared/ui/gesuch-step-wrapper';
import { SachbearbeitungAppPatternGesuchStepLayoutComponent } from '@dv/sachbearbeitung-app/pattern/gesuch-step-layout';

@Component({
  selector: 'dv-sachbearbeitung-app-pattern-gesuch-step-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiGesuchStepWrapperComponent,
    SachbearbeitungAppPatternGesuchStepLayoutComponent,
  ],
  templateUrl:
    './sachbearbeitung-app-pattern-gesuch-step-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppPatternGesuchStepWrapperComponent {}
