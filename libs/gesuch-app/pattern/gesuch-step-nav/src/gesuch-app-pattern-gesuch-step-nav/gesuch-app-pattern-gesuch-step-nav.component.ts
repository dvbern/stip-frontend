import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gesuch-app-pattern-gesuch-step-nav.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepNavComponent {}
