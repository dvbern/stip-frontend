import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {SharedUiFormFieldComponent, SharedUiFormMessageComponent} from "../../../../../../shared/ui/form-field/src";
import {SharedUiProgressBarComponent} from "../../../../../../shared/ui/progress-bar/src";

@Component({
  selector: 'dv-gesuch-app-feature-eltern',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedUiProgressBarComponent, TranslateModule, SharedUiFormFieldComponent, SharedUiFormFieldComponent, SharedUiFormMessageComponent, SharedUiProgressBarComponent],
  templateUrl: './gesuch-app-feature-eltern.component.html',
  styleUrls: ['./gesuch-app-feature-eltern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureElternComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
          name: ['', [Validators.required]],
          vorname: [undefined, Validators.required],
          telefonnummer: [undefined],
          sozialversicherungsnummer: [undefined],
          geburtsdatum: [undefined],
          sozialhilfebeitraegeAusbezahlt: [undefined],
          ausweisbFluechtling: [undefined],
          ergaenzungsleistungAusbezahlt: [undefined],
        });

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //TODO navigate next and save
    }
  }

  handleSaveAndBack() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //TODO Navigate back and save
    }
  }
}
