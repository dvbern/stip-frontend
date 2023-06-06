import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedUiProgressBarComponent} from "@dv/shared/ui/progress-bar";
import {TranslateModule} from "@ngx-translate/core";
import {SharedUiFormFieldComponent, SharedUiFormLabelTargetDirective} from "@dv/shared/ui/form-field";
import {ElternForm} from "./ElternForm";
import {SharedUiDvFormComponentComponent} from "../../../../../../shared/ui/dv-form-component/src";

@Component({
  selector: 'dv-gesuch-app-feature-eltern',
  standalone: true,
  imports: [CommonModule, SharedUiProgressBarComponent, TranslateModule, SharedUiFormFieldComponent, SharedUiDvFormComponentComponent],
  templateUrl: './gesuch-app-feature-eltern.component.html',
  styleUrls: ['./gesuch-app-feature-eltern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureElternComponent {

  form: ElternForm = new ElternForm();


}
