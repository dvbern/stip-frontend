import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import {
  Anrede,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  Niederlassungsstatus,
  PATTERN_EMAIL,
  PersonInAusbildungDTO,
  SharedModelGesuch,
  Wohnsitz,
  Zivilstand,
  Sprache,
} from '@dv/shared/model/gesuch';
import {
  DocumentOptions,
  SharedPatternDocumentUploadComponent,
} from '@dv/shared/pattern/document-upload';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
  SharedUiFormMessageInfoDirective,
} from '@dv/shared/ui/form';

import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { sharedUtilValidatorAhv } from '@dv/shared/util/validator-ahv';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onDateInputBlur,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { sharedUtilValidatorTelefonNummer } from '@dv/shared/util/validator-telefon-nummer';
import { MaskitoModule } from '@maskito/angular';
import { NgbAlert, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { subYears } from 'date-fns';

import { selectGesuchAppFeatureGesuchFormEducationView } from './gesuch-app-feature-gesuch-form-person.selector';
import { SharedUtilFormService } from '@dv/shared/util/form';

const MIN_AGE_GESUCHSSTELLER = 10;
const MAX_AGE_GESUCHSSTELLER = 130;
const MEDIUM_AGE_GESUCHSSTELLER = 20;

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-person',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaskitoModule,
    NgbInputDatepicker,
    NgbAlert,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageInfoDirective,
    SharedUiFormMessageErrorDirective,
    GesuchAppPatternGesuchStepLayoutComponent,
    SharedUiFormAddressComponent,
    SharedPatternDocumentUploadComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-person.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormPersonComponent implements OnInit {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);
  private formUtils = inject(SharedUtilFormService);
  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;
  readonly anredeValues = Object.values(Anrede);
  readonly Zivilstand = Zivilstand;
  readonly spracheValues = Object.values(Sprache);
  readonly zivilstandValues = Object.values(Zivilstand);
  readonly wohnsitzValues = Object.values(Wohnsitz);
  readonly niederlassungsStatusValues = Object.values(Niederlassungsstatus);
  laenderSig = computed(() => {
    return this.view().laender;
  });
  languageSig = this.store.selectSignal(selectLanguage);
  view = this.store.selectSignal(selectGesuchAppFeatureGesuchFormEducationView);

  nationalitaetCH = 'CH';
  auslaenderausweisDocumentOptions = computed(() => {
    return {
      resource: 'gesuch',
      resourceId: this.view().gesuch ? this.view().gesuch!.id! : null,
      type: 'person',
    } as DocumentOptions;
  });

  form = this.formBuilder.group({
    sozialversicherungsnummer: [
      '',
      [Validators.required, sharedUtilValidatorAhv],
    ],
    anrede: ['', [Validators.required]],
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(
      this.formBuilder
    ),
    identischerZivilrechtlicherWohnsitz: [true, []],
    zivilrechtlicherWohnsitzPlz: ['', [Validators.required]],
    zivilrechtlicherWohnsitzOrt: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(PATTERN_EMAIL)]],
    telefonnummer: [
      '',
      [Validators.required, sharedUtilValidatorTelefonNummer()],
    ],
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'date'),
        minDateValidatorForLocale(
          this.languageSig(),
          subYears(new Date(), MAX_AGE_GESUCHSSTELLER),
          'date'
        ),
        maxDateValidatorForLocale(
          this.languageSig(),
          subYears(new Date(), MIN_AGE_GESUCHSSTELLER),
          'date'
        ),
      ],
    ],
    nationalitaet: ['', [Validators.required]],
    heimatort: ['', [Validators.required]],
    niederlassungsstatus: ['', [Validators.required]],
    vormundschaft: new FormControl<boolean | null>(null, []),
    zivilstand: ['', [Validators.required]],
    wohnsitz: ['', [Validators.required]],
    sozialhilfebeitraege: new FormControl<boolean | null>(null, []),
    quellenbesteuerung: new FormControl<boolean | null>(null, []),
    digitaleKommunikation: [true, []],
    korrespondenzSprache: ['', [Validators.required]],
  });

  constructor() {
    // patch form value
    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch?.personInAusbildungContainer?.personInAusbildungSB) {
          const person =
            gesuch.personInAusbildungContainer.personInAusbildungSB;
          const personForForm = {
            ...person,
            geburtsdatum: parseBackendLocalDateAndPrint(
              person.geburtsdatum,
              this.languageSig()
            ),
          };
          this.form.patchValue({ ...personForForm });
        }
      },
      { allowSignalWrites: true }
    );
    const zivilrechtlichChanged$ = toSignal(
      this.form.controls.identischerZivilrechtlicherWohnsitz.valueChanges
    );
    effect(
      () => {
        const zivilrechtlichIdentisch = zivilrechtlichChanged$();
        if (zivilrechtlichIdentisch) {
          this.form.controls.zivilrechtlicherWohnsitzPlz.patchValue('');
          this.form.controls.zivilrechtlicherWohnsitzOrt.patchValue('');
          this.form.controls.zivilrechtlicherWohnsitzPlz.disable();
          this.form.controls.zivilrechtlicherWohnsitzOrt.disable();
        } else {
          this.form.controls.zivilrechtlicherWohnsitzPlz.enable();
          this.form.controls.zivilrechtlicherWohnsitzOrt.enable();
        }
        this.form.controls.zivilrechtlicherWohnsitzPlz.updateValueAndValidity();
        this.form.controls.zivilrechtlicherWohnsitzOrt.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );

    const nationalitaetChanged$ = toSignal(
      this.form.controls.nationalitaet.valueChanges
    );
    effect(
      () => {
        const nationalitaetChanged = nationalitaetChanged$();
        // If nationality is Switzerland
        if (this.form.controls.nationalitaet.value === this.nationalitaetCH) {
          this.form.controls.heimatort.enable();
          this.form.controls.vormundschaft.enable();
          this.formUtils.setDisabledState(
            this.form.controls.niederlassungsstatus,
            true,
            true
          );
        }
        // No nationality was selected
        else if (nationalitaetChanged === undefined) {
          this.form.controls.niederlassungsstatus.patchValue('');
          this.form.controls.niederlassungsstatus.disable();
          this.formUtils.setDisabledState(
            this.form.controls.heimatort,
            true,
            true
          );
          this.formUtils.setDisabledState(
            this.form.controls.vormundschaft,
            true,
            true
          );
        }
        // Any other nationality was selected
        else {
          this.form.controls.niederlassungsstatus.enable();
          this.formUtils.setDisabledState(
            this.form.controls.heimatort,
            true,
            true
          );
          this.formUtils.setDisabledState(
            this.form.controls.vormundschaft,
            true,
            true
          );
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormPerson.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
  }

  handleSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormPerson.saveTriggered({
          origin: GesuchFormSteps.PERSON,
          gesuch: this.buildUpdatedGesuchFromForm(),
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  onGeburtsdatumBlur(_: any) {
    return onDateInputBlur(
      this.form.controls.geburtsdatum,
      subYears(new Date(), MEDIUM_AGE_GESUCHSSTELLER),
      this.languageSig()
    );
  }

  private buildUpdatedGesuchFromForm() {
    const gesuch = this.view().gesuch;
    return {
      ...gesuch,
      personInAusbildungContainer: {
        ...gesuch?.personInAusbildungContainer,
        personInAusbildungSB: {
          ...gesuch?.personInAusbildungContainer?.personInAusbildungSB,
          ...this.form.getRawValue(),
          adresse: {
            ...gesuch?.personInAusbildungContainer?.personInAusbildungSB
              ?.adresse,
            ...this.form.getRawValue().adresse,
          },
          geburtsdatum: parseStringAndPrintForBackendLocalDate(
            this.form.getRawValue().geburtsdatum,
            this.languageSig(),
            subYears(new Date(), MEDIUM_AGE_GESUCHSSTELLER)
          ),
        } as PersonInAusbildungDTO,
      },
    } as SharedModelGesuch;
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
