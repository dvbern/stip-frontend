import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dv-shared-ui-step-form-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-ui-step-form-buttons.component.html',
  styleUrls: ['./shared-ui-step-form-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppUiStepFormButtonsComponent {
  @HostBinding('class') classes =
    'col-12 col-xl-8 mt-5 d-flex flex-column gap-3 flex-md-row align-items-center justify-content-center';
}
