import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import {
  AdresseDTO,
  Anrede,
  ElternDTO,
  Land,
  MASK_SOZIALVERSICHERUNGSNUMMER,
} from '@dv/shared/model/gesuch';
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { subYears } from 'date-fns';

const MAX_AGE_ADULT = 120;
const MIN_AGE_ADULT = 16;
const MEDIUM_AGE_ADULT = 40;

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-eltern-editor',
  standalone: true,
  imports: [
    CommonModule,
    MaskitoModule,
    TranslateModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiFormAddressComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-eltern-editor.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-eltern-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormElternEditorComponent
  implements OnChanges
{
  private formBuilder = inject(FormBuilder);

  @Input({ required: true }) elternteil!: Partial<ElternDTO>;
  @Output() saveTriggered = new EventEmitter<ElternDTO>();
  @Output() autoSaveTriggered = new EventEmitter<ElternDTO>();
  @Output() closeTriggered = new EventEmitter<void>();

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;
  readonly Land = Land;
  readonly Anrede = Anrede;

  private store = inject(Store);

  language = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(
      this.formBuilder
    ),
    identischerZivilrechtlicherWohnsitz: [false, []],
    telefonnummer: ['', [Validators.required]],
    sozialversicherungsnummer: ['', [Validators.required]],
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.language()),
        minDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MAX_AGE_ADULT)
        ),
        maxDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MIN_AGE_ADULT)
        ),
      ],
    ],
    sozialhilfebeitraegeAusbezahlt: [false, [Validators.required]],
    ausweisbFluechtling: [false, [Validators.required]],
    ergaenzungsleistungAusbezahlt: [false, [Validators.required]],
  });

  ngOnChanges() {
    this.form.patchValue({
      ...this.elternteil,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.elternteil.geburtsdatum,
        this.language()
      ),
    });
  }

  handleSave() {
    this.form.markAsTouched();
    if (this.form.valid) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.elternteil.id!,
        geschlecht: this.elternteil.geschlecht!,
        geburtsdatum: parseStringAndPrintForBackendLocalDate(
          this.form.getRawValue().geburtsdatum,
          this.language(),
          subYears(new Date(), MEDIUM_AGE_ADULT)
        )!,
        adresse: {
          ...this.form.getRawValue().adresse,
          id: this.elternteil.adresse?.id || '', // TODO wie geht das bei neuen entities?
          land: this.form.getRawValue().adresse.land as Land,
        } as AdresseDTO,
      } as ElternDTO);
    }
  }
  trackByIndex(index: number) {
    return index;
  }

  handleCancel() {
    this.closeTriggered.emit();
  }
}
