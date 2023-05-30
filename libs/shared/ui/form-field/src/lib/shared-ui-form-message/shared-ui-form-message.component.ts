import {
  ChangeDetectionStrategy,
  Component,
  Host,
  inject,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import { NgIf } from '@angular/common';

import { SharedUiFormMessageInfoDirective } from './shared-ui-form-message-info.directive';
import { SharedUiFormMessageErrorDirective } from './shared-ui-form-message-error.directive';

@Component({
  selector: 'dv-shared-ui-form-message',
  standalone: true,
  imports: [NgIf],
  templateUrl: './shared-ui-form-message.component.html',
  styleUrls: ['./shared-ui-form-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormMessageComponent implements OnInit {
  private infoMessage = inject(SharedUiFormMessageInfoDirective, {
    optional: true,
    host: true,
  });
  private errorMessage = inject(SharedUiFormMessageErrorDirective, {
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
