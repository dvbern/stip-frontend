import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dv-shared-ui-form-label',
  standalone: true,
  templateUrl: './shared-ui-form-label.component.html',
  styleUrls: ['./shared-ui-form-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormLabelComponent {}
