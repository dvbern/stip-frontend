import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-shared-ui-stepper-navigation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './shared-ui-stepper-navigation.component.html',
  styleUrls: ['./shared-ui-stepper-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiStepperNavigationComponent {
  @Input() nextStepVisible = false;
  @Input() prevStepVisible = false;

  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();
}
