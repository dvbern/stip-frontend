import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dv-shared-ui-form-field-label',
  standalone: true,
  templateUrl: './shared-ui-form-field-label.component.html',
  styleUrls: ['./shared-ui-form-field-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormFieldLabelComponent {}
