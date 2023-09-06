import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dv-gesuch-app-ui-stepper-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gesuch-app-ui-stepper-navigation.component.html',
  styleUrls: ['./gesuch-app-ui-stepper-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppUiStepperNavigationComponent {
  @Input() nextStepVisible = false;
  @Input() prevStepVisible = false;

  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();
}
