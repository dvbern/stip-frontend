import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import {
  Anrede,
  Land,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  Niederlassungsstatus,
  PATTERN_EMAIL,
  Sprache,
  Wohnsitz,
  Zivilstand,
} from '@dv/shared/model/gesuch';
import {
  DocumentOptions,
  SharedPatternDocumentUploadComponent,
} from '@dv/shared/pattern/document-upload';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';

import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import {
  optionalRequiredBoolean,
  SharedUtilFormService,
  unsetString,
} from '@dv/shared/util/form';
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
import {
  addWohnsitzControls,
  SharedUiWohnsitzSplitterComponent,
  wohnsitzAnteileString,
  wohnsitzAnteileNumber,
  updateWohnsitzControlsState,
} from '@dv/shared/ui/wohnsitz-splitter';
import { SharedUiFormCountryComponent } from '@dv/shared/ui/form-country';
import { SharedUtilCountriesService } from '@dv/shared/util/countries';

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
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    NgbInputDatepicker,
    NgbAlert,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    SharedUiFormCountryComponent,
    SharedUiWohnsitzSplitterComponent,
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
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);
  private countriesService = inject(SharedUtilCountriesService);
  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;
  readonly anredeValues = Object.values(Anrede);
  readonly Zivilstand = Zivilstand;
  readonly spracheValues = Object.values(Sprache);
  readonly zivilstandValues = Object.values(Zivilstand);
  readonly wohnsitzValues = Object.values(Wohnsitz);
  readonly niederlassungsStatusValues = Object.values(Niederlassungsstatus);
  languageSig = this.store.selectSignal(selectLanguage);
  view = this.store.selectSignal(selectGesuchAppFeatureGesuchFormEducationView);
  updateValidity$ = new Subject<unknown>();
  laenderSig = computed(() => this.view().laender);
  translatedLaender$ = toObservable(this.laenderSig).pipe(
    switchMap((laender) => this.countriesService.getCountryList(laender))
  );

  nationalitaetCH = 'CH';
  auslaenderausweisDocumentOptions = computed(() => {
    return {
      resource: 'gesuch',
      resourceId: this.view().gesuch?.id,
      type: 'person',
    } as DocumentOptions;
  });

  form = this.formBuilder.group({
    sozialversicherungsnummer: [
      '',
      [Validators.required, sharedUtilValidatorAhv],
    ],
    anrede: this.formBuilder.control<Anrede>('' as Anrede, {
      validators: Validators.required,
    }),
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
    nationalitaet: this.formBuilder.control<Land>('' as Land, {
      validators: Validators.required,
    }),
    heimatort: ['', [Validators.required]],
    niederlassungsstatus: this.formBuilder.control<
      Niederlassungsstatus | undefined
    >(undefined, { validators: Validators.required }),
    vormundschaft: [false, []],
    zivilstand: this.formBuilder.control<Zivilstand>('' as Zivilstand, {
      validators: Validators.required,
    }),
    ...addWohnsitzControls(this.formBuilder),
    quellenbesteuert: [optionalRequiredBoolean, [Validators.required]],
    sozialhilfebeitraege: [optionalRequiredBoolean, [Validators.required]],
    digitaleKommunikation: [true, []],
    korrespondenzSprache: this.formBuilder.control<Sprache>('' as Sprache, {
      validators: Validators.required,
    }),
  });

  private wohnsitzChangedSig = toSignal(
    this.form.controls.wohnsitz.valueChanges
  );

  showWohnsitzSplitterSig = computed(() => {
    return this.wohnsitzChangedSig() === Wohnsitz.MUTTER_VATER;
  });

  constructor() {
    // patch form value
    effect(
      () =>
        updateWohnsitzControlsState(
          this.formUtils,
          this.form.controls,
          !this.showWohnsitzSplitterSig()
        ),
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const { gesuchFormular } = this.view();
        if (gesuchFormular?.personInAusbildung) {
          const person = gesuchFormular.personInAusbildung;
          const personForForm = {
            ...person,
            geburtsdatum: parseBackendLocalDateAndPrint(
              person.geburtsdatum,
              this.languageSig()
            ),
          };
          this.form.patchValue({
            ...personForForm,
            ...wohnsitzAnteileString(person),
          });
        }
      },
      { allowSignalWrites: true }
    );
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
          this.formUtils.setDisabledState(
            this.form.controls.niederlassungsstatus,
            true,
            true
          );
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
    this.updateValidity$.next({});
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormPerson.saveTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.PERSON,
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  onGeburtsdatumBlur() {
    return onDateInputBlur(
      this.form.controls.geburtsdatum,
      subYears(new Date(), MEDIUM_AGE_GESUCHSSTELLER),
      this.languageSig()
    );
  }

  private buildUpdatedGesuchFromForm() {
    const { gesuch, gesuchFormular } = this.view();
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        personInAusbildung: {
          ...this.form.getRawValue(),
          adresse: {
            id: gesuchFormular?.personInAusbildung?.adresse?.id,
            ...this.form.getRawValue().adresse,
          },
          geburtsdatum: parseStringAndPrintForBackendLocalDate(
            this.form.getRawValue().geburtsdatum,
            this.languageSig(),
            subYears(new Date(), MEDIUM_AGE_GESUCHSSTELLER)
          )!,
          ...wohnsitzAnteileNumber(this.form.getRawValue()),

          // TODO missing fields that exist on the Adresse:
          quellenbesteuert: false,
        },
      },
    };
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
