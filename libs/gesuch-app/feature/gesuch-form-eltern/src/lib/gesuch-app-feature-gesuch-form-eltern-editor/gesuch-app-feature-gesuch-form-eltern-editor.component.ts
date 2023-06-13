import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaskitoModule } from '@maskito/angular';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import {
  Anrede,
  ElternDTO,
  Land,
  MASK_SOZIALVERSICHERUNGSNUMMER,
} from '@dv/shared/model/gesuch';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-eltern-editor',
  standalone: true,
  imports: [
    CommonModule,
    MaskitoModule,
    TranslateModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedUiFormFieldComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-eltern-editor.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-eltern-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormElternEditorComponent
  implements OnChanges
{
  private formBuilder = inject(FormBuilder);

  @Input({ required: true }) parent!: ElternDTO;
  @Output() save = new EventEmitter<ElternDTO>();
  @Output() cancel = new EventEmitter<void>();

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;
  readonly Land = Land;
  readonly Anrede = Anrede;

  geburtsdatumMinDate: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  geburtsdatumMaxDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    addresse: this.formBuilder.group({
      strasse: ['', [Validators.required]],
      nummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: ['', [Validators.required]],
    }),
    identischerZivilrechtlicherWohnsitz: [false, []],
    telefonnummer: ['', [Validators.required]],
    sozialversicherungsnummer: ['', [Validators.required]],
    geburtsdatum: ['', [Validators.required]],
    sozialhilfebeitraegeAusbezahlt: [false, [Validators.required]],
    ausweisbFluechtling: [false, [Validators.required]],
    ergaenzungsleistungAusbezahlt: [false, [Validators.required]],
  });

  ngOnChanges() {
    this.form.patchValue(this.parent);
  }

  handleSave() {
    this.form.markAsTouched();
    if (this.form.valid) {
      // TODO MAKE THE DTO AND FORM MATCH
      this.save.emit(this.form.getRawValue() as any);
    }
  }
  trackByIndex(index: number) {
    return index;
  }

  handleCancel() {
    this.cancel.emit();
  }
}
