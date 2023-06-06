import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective
} from "@dv/shared/ui/form-field";

@Component({
  selector: 'dv-shared-ui-dv-form-component',
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedUiFormLabelComponent, SharedUiFormMessageComponent, SharedUiFormMessageErrorDirective, SharedUiFormFieldComponent],
  templateUrl: './shared-ui-dv-form-component.component.html',
  styleUrls: ['./shared-ui-dv-form-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiDvFormComponentComponent {

  @Input() label: string | undefined;
}
