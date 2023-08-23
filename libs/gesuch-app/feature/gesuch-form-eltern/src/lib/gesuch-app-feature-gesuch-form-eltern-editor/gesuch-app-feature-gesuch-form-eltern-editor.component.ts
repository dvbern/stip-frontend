import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import {
  ElternTyp,
  Land,
  ElternUpdate,
  MASK_SOZIALVERSICHERUNGSNUMMER,
} from '@dv/shared/model/gesuch';
import {
  convertTempFormToRealValues,
  SharedUtilFormService,
} from '@dv/shared/util/form';
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
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    SharedUiFormFieldDirective,
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
  private elementRef = inject(ElementRef);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);
  private store = inject(Store);

  @Input({ required: true }) elternteil!: Omit<
    Partial<ElternUpdate>,
    'elternTyp'
  > &
    Required<Pick<ElternUpdate, 'elternTyp'>>;
  @Output() saveTriggered = new EventEmitter<ElternUpdate>();
  @Output() closeTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<string>();
  @Input({ required: true }) laender!: Land[];

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;

  readonly ElternTyp = ElternTyp;

  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    nachname: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(
      this.formBuilder
    ),
    identischerZivilrechtlicherWohnsitz: [true, []],
    identischerZivilrechtlicherWohnsitzPLZ: [
      <string | undefined>undefined,
      [Validators.required],
    ],
    identischerZivilrechtlicherWohnsitzOrt: [
      <string | undefined>undefined,
      [Validators.required],
    ],
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
    sozialhilfebeitraegeAusbezahlt: [
      <boolean | null>null,
      [Validators.required],
    ],
    ausweisbFluechtling: [<boolean | null>null, [Validators.required]],
    ergaenzungsleistungAusbezahlt: [
      <boolean | null>null,
      [Validators.required],
    ],
  });

  constructor() {
    // zivilrechtlicher Wohnsitz -> PLZ/Ort enable/disable
    const zivilrechtlichChanged$ = this.formUtils.signalFromChanges(
      this.form.controls.identischerZivilrechtlicherWohnsitz,
      { useDefault: true }
    );
    effect(
      () => {
        const zivilrechtlichIdentisch = zivilrechtlichChanged$() === true;
        this.formUtils.setDisabledState(
          this.form.controls.identischerZivilrechtlicherWohnsitzPLZ,
          zivilrechtlichIdentisch,
          true
        );
        this.formUtils.setDisabledState(
          this.form.controls.identischerZivilrechtlicherWohnsitzOrt,
          zivilrechtlichIdentisch,
          true
        );
        this.form.controls.identischerZivilrechtlicherWohnsitzPLZ.updateValueAndValidity();
        this.form.controls.identischerZivilrechtlicherWohnsitzOrt.updateValueAndValidity();
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
    this.formUtils.focusFirstInvalid(this.elementRef);
    const formValues = convertTempFormToRealValues(this.form, {
      required: [
        'sozialhilfebeitraegeAusbezahlt',
        'ausweisbFluechtling',
        'ergaenzungsleistungAusbezahlt',
      ],
    });
    const geburtsdatum = parseStringAndPrintForBackendLocalDate(
      formValues.geburtsdatum,
      this.languageSig(),
      subYears(new Date(), MEDIUM_AGE_ADULT)
    );
    if (this.form.valid && geburtsdatum) {
      this.saveTriggered.emit({
        ...formValues,
        adresse: {
          ...formValues.adresse,
          id: this.elternteil.adresse?.id,
        },
        id: this.elternteil.id,
        elternTyp: this.elternteil.elternTyp,
        geburtsdatum,
      });
    }
  }

  handleDelete() {
    if (this.elternteil?.id) {
      this.deleteTriggered.emit(this.elternteil.id);
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
