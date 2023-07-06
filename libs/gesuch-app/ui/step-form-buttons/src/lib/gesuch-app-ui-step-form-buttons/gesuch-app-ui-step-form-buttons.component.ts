import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dv-gesuch-app-ui-step-form-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gesuch-app-ui-step-form-buttons.component.html',
  styleUrls: ['./gesuch-app-ui-step-form-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppUiStepFormButtonsComponent {}
