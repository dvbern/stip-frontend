import { CommonModule } from '@angular/common';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import {
  AdresseDTO,
  Anrede,
  ElternDTO,
  Land,
  LandDTO,
  MASK_SOZIALVERSICHERUNGSNUMMER,
} from '@dv/shared/model/gesuch';
import { SharedUtilFormService } from '@dv/shared/util/form';
import { sharedUtilValidatorTelefonNummer } from '@dv/shared/util/validator-telefon-nummer';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onDateInputBlur,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { sharedUtilValidatorAhv } from '@dv/shared/util/validator-ahv';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { subYears } from 'date-fns';

const MAX_AGE_ADULT = 130;
const MIN_AGE_ADULT = 10;
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
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-eltern-editor.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-eltern-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormElternEditorComponent
  implements OnChanges
{
  private formBuilder = inject(FormBuilder);
  private formUtils = inject(SharedUtilFormService);

  @Input({ required: true }) elternteil!: Partial<ElternDTO>;
  @Output() saveTriggered = new EventEmitter<ElternDTO>();
  @Output() closeTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<string>();
  @Input({ required: true }) laender!: LandDTO[];

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;

  readonly Anrede = Anrede;

  private store = inject(Store);

  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(
      this.formBuilder
    ),
    identischerZivilrechtlicherWohnsitz: [true, []],
    izvPLZ: ['', [Validators.required]],
    izvOrt: ['', [Validators.required]],
    telefonnummer: [
      '',
      [Validators.required, sharedUtilValidatorTelefonNummer()],
    ],
    sozialversicherungsnummer: [
      '',
      [Validators.required, sharedUtilValidatorAhv],
    ],
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'date'),
        minDateValidatorForLocale(
          this.languageSig(),
          subYears(new Date(), MAX_AGE_ADULT),
          'date'
        ),
        maxDateValidatorForLocale(
          this.languageSig(),
          subYears(new Date(), MIN_AGE_ADULT),
          'date'
        ),
      ],
    ],
    sozialhilfebeitraegeAusbezahlt: [false, [Validators.required]],
    ausweisbFluechtling: [false, [Validators.required]],
    ergaenzungsleistungAusbezahlt: [false, [Validators.required]],
  });

  constructor() {
    // zivilrechtlicher Wohnsitz -> PLZ/Ort enable/disable
    const zivilrechtlichChanged$ = toSignal(
      this.form.controls.identischerZivilrechtlicherWohnsitz.valueChanges
    );
    effect(
      () => {
        const zivilrechtlichIdentisch = zivilrechtlichChanged$() === true;
        this.formUtils.setDisabledState(
          this.form.controls.izvPLZ,
          zivilrechtlichIdentisch,
          true
        );
        this.formUtils.setDisabledState(
          this.form.controls.izvOrt,
          zivilrechtlichIdentisch,
          true
        );
        this.form.controls.izvPLZ.updateValueAndValidity();
        this.form.controls.izvOrt.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );
  }

  ngOnChanges() {
    this.form.patchValue({
      ...this.elternteil,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.elternteil.geburtsdatum,
        this.languageSig()
      ),
    });
  }

  handleSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.elternteil.id!,
        geschlecht: this.elternteil.geschlecht!,
        geburtsdatum: parseStringAndPrintForBackendLocalDate(
          this.form.getRawValue().geburtsdatum,
          this.languageSig(),
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

  handleDelete() {
    if (this.elternteil?.id) {
      this.deleteTriggered.emit(this.elternteil!.id);
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  handleCancel() {
    this.closeTriggered.emit();
  }

  onGeburtsdatumBlur(_: any) {
    return onDateInputBlur(
      this.form.controls.geburtsdatum,
      subYears(new Date(), MEDIUM_AGE_ADULT),
      this.languageSig()
    );
  }
}
