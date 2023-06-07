import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedUiProgressBarComponent} from "@dv/shared/ui/progress-bar";
import {TranslateModule} from "@ngx-translate/core";
import {SharedUiFormFieldComponent} from "@dv/shared/ui/form-field";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'dv-gesuch-app-feature-eltern',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedUiProgressBarComponent, TranslateModule, SharedUiFormFieldComponent],
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
