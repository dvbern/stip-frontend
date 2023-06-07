import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormMessageComponent,
} from '@dv/shared/ui/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-eltern',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiProgressBarComponent,
    SharedUiFormFieldComponent,
    SharedUiFormMessageComponent,
    SharedUiFormLabelComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-eltern.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-eltern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormElternComponent implements OnInit {
  private store = inject(Store);

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

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormEltern.init());
  }

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
