import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SachbearbeitungAppPatternGesuchStepLayoutComponent } from '@dv/sachbearbeitung-app/pattern/gesuch-step-layout';

@Component({
  selector: 'dv-sachbearbeitung-app-feature-gesuch-form',
  standalone: true,
  imports: [CommonModule, SachbearbeitungAppPatternGesuchStepLayoutComponent],
  templateUrl: './sachbearbeitung-app-feature-gesuch-form.component.html',
  styleUrls: ['./sachbearbeitung-app-feature-gesuch-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppFeatureGesuchFormComponent {}
