import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { NgIf } from '@angular/common';

import { SharedUiFormFieldMessageInfoDirective } from './shared-ui-form-field-message-info.directive';
import { SharedUiFormFieldMessageErrorDirective } from './shared-ui-form-field-message-error.directive';

@Component({
  selector: 'dv-shared-ui-form-field-message',
  standalone: true,
  imports: [NgIf],
  templateUrl: './shared-ui-form-field-message.component.html',
  styleUrls: ['./shared-ui-form-field-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormFieldMessageComponent implements OnInit {
  private infoMessage = inject(SharedUiFormFieldMessageInfoDirective, {
    optional: true,
    host: true,
  });
  private errorMessage = inject(SharedUiFormFieldMessageErrorDirective, {
    optional: true,
    host: true,
  });

  @Input() level: 'info' | 'error' = 'info';

  ngOnInit(): void {
    if (this.infoMessage) {
      this.level = 'info';
    }

    if (this.errorMessage) {
      this.level = 'error';
    }
  }
}
