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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Anrede,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  PersonInAusbildungDTO,
  SharedModelGesuch,
  Wohnsitz,
  Zivilstand,
} from '@dv/shared/model/gesuch';
import { SharedPatternDocumentUploadComponent } from '@dv/shared/pattern/document-upload';
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
  parseDateForLocale,
  parseStringAndPrintForBackendLocalDate,
  printDate,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbAlert, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { isValid, subYears } from 'date-fns';

const MIN_AGE_GESUCHSSTELLER = 15;
const MAX_AGE_GESUCHSSTELLER = 35;
const MEDIUM_AGE_GESUCHSSTELLER = 20;
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { SharedPatternDocumentUploadComponent } from '@dv/shared/pattern/document-upload';
import { selectGesuchAppFeatureGesuchFormEducationView } from './gesuch-app-feature-gesuch-form-person.selector';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';

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
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-person.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormPersonComponent implements OnInit {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;
  readonly Anrede = Anrede;
  readonly Zivilstand = Zivilstand;
  readonly Wohnsitz = Wohnsitz;

  geburtsdatumMinDate: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  geburtsdatumMaxDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  laenderSig = computed(() => {
    return this.view().laender;
  });
  languageSig = this.store.selectSignal(selectLanguage);
  language = this.store.selectSignal(selectLanguage);

  language = 'de';
  view = this.store.selectSignal(selectGesuchAppFeatureGesuchFormEducationView);

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
    email: ['', [Validators.required]],
    telefonnummer: ['', [Validators.required]],
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.language()),
        minDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MAX_AGE_GESUCHSSTELLER)
        ),
        maxDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MIN_AGE_GESUCHSSTELLER)
        ),
      ],
    ],
    nationalitaet: ['', [Validators.required]],
    heimatort: ['', [Validators.required]],
    vormundschaft: [false, []],
    zivilstand: ['', [Validators.required]],
    wohnsitz: ['', [Validators.required]],
    sozialhilfebeitraege: [false, []],
    quellenbesteuerung: [false, []],
    digitaleKommunikation: [false, []],
  });

  constructor() {
    effect(() => {
      const { gesuch } = this.view();
      this.language = this.languageSig();
      if (gesuch?.personInAusbildungContainer?.personInAusbildungSB) {
        const person = gesuch.personInAusbildungContainer.personInAusbildungSB;
        const personForForm = {
          ...person,
          geburtsdatum: parseBackendLocalDateAndPrint(
            person.geburtsdatum,
            this.language()
          ),
        };
        this.form.patchValue({ ...personForForm });
      }
    });
    const zivilrechtlichChanged$ = toSignal(
      this.form.controls.identischerZivilrechtlicherWohnsitz.valueChanges
    );
    effect(() => {
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
    });
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
      this.language()
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
            this.language(),
            subYears(new Date(), MEDIUM_AGE_GESUCHSSTELLER)
          ),
        } as PersonInAusbildungDTO,
      },
    } as SharedModelGesuch;
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
