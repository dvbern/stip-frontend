import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MaskitoModule } from '@maskito/angular';
import { NgbAlert, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { subYears } from 'date-fns';

import { SharedEventGesuchFormPerson } from '@dv/shared/event/gesuch-form-person';
import { PERSON } from '@dv/shared/model/gesuch-form';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
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
  convertTempFormToRealValues,
  SharedUtilFormService,
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
import {
  addWohnsitzControls,
  SharedUiWohnsitzSplitterComponent,
  wohnsitzAnteileString,
  wohnsitzAnteileNumber,
  updateWohnsitzControlsState,
} from '@dv/shared/ui/wohnsitz-splitter';
import { SharedUiFormCountryComponent } from '@dv/shared/ui/form-country';
import { SharedUiInfoOverlayComponent } from '@dv/shared/ui/info-overlay';
import { SharedUtilCountriesService } from '@dv/shared/util/countries';

import { selectSharedFeatureGesuchFormEducationView } from './shared-feature-gesuch-form-person.selector';

const MIN_AGE_GESUCHSSTELLER = 10;
const MAX_AGE_GESUCHSSTELLER = 130;
const MEDIUM_AGE_GESUCHSSTELLER = 20;

@Component({
  selector: 'dv-shared-feature-gesuch-form-person',
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
    SharedUiInfoOverlayComponent,
    NgbInputDatepicker,
    NgbAlert,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    SharedUiFormCountryComponent,
    SharedUiWohnsitzSplitterComponent,
    SharedUiFormAddressComponent,
    SharedPatternDocumentUploadComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-person.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormPersonComponent implements OnInit {
  private elementRef = inject(ElementRef);
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
  viewSig = this.store.selectSignal(selectSharedFeatureGesuchFormEducationView);
  updateValidity$ = new Subject<unknown>();
  laenderSig = computed(() => this.viewSig().laender);
  translatedLaender$ = toObservable(this.laenderSig).pipe(
    switchMap((laender) => this.countriesService.getCountryList(laender))
  );
  hiddenFieldsSetSig = signal(new Set());
  isSozialversicherungsnummerInfoShown = false;
  isNiederlassungsstatusInfoShown = false;
  nationalitaetCH = 'CH';
  auslaenderausweisDocumentOptionsSig: Signal<DocumentOptions | null> =
    computed(() => {
      const gesuch = this.viewSig().gesuch;
      return gesuch
        ? {
            gesuchId: gesuch.id,
            dokumentTyp: 'PERSON_IN_AUSBILDUNG_DOK',
          }
        : null;
    });

  form = this.formBuilder.group({
    sozialversicherungsnummer: ['', []],
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
    heimatort: [<string | undefined>undefined, [Validators.required]],
    niederlassungsstatus: this.formBuilder.control<
      Niederlassungsstatus | undefined
    >(undefined, { validators: Validators.required }),
    vormundschaft: [false, []],
    zivilstand: this.formBuilder.control<Zivilstand>('' as Zivilstand, {
      validators: Validators.required,
    }),
    ...addWohnsitzControls(this.formBuilder),
    quellenbesteuert: [<boolean | null>null, [Validators.required]],
    sozialhilfebeitraege: [<boolean | null>null, [Validators.required]],
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

  private nationalitaetChangedSig = toSignal(
    this.form.controls.nationalitaet.valueChanges
  );

  showAuslaenderAusweisSig = computed(() => {
    return (
      this.nationalitaetChangedSig() &&
      this.nationalitaetChangedSig() !== this.nationalitaetCH
    );
  });

  constructor() {
    effect(
      () => {
        updateWohnsitzControlsState(
          this.formUtils,
          this.form.controls,
          this.viewSig().readonly
        );
        this.updateVisbility(
          this.form.controls.wohnsitzAnteilMutter,
          this.showWohnsitzSplitterSig(),
          { resetOnInvisible: true }
        );
        this.updateVisbility(
          this.form.controls.wohnsitzAnteilVater,
          this.showWohnsitzSplitterSig(),
          { resetOnInvisible: true }
        );
      },
      { allowSignalWrites: true }
    );
    // patch form value
    effect(
      () => {
        const { gesuchFormular } = this.viewSig();

        const svValidators = [
          Validators.required,
          sharedUtilValidatorAhv('personInAusbildung', gesuchFormular),
        ];
        this.form.controls.sozialversicherungsnummer.clearValidators();
        this.form.controls.sozialversicherungsnummer.addValidators(
          svValidators
        );
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
        } else {
          this.form.reset();
        }
      },
      { allowSignalWrites: true }
    );
    const zivilrechtlichChangedSig = this.formUtils.signalFromChanges(
      this.form.controls.identischerZivilrechtlicherWohnsitz,
      { useDefault: true }
    );
    effect(
      () => {
        const zivilrechtlichIdentisch = zivilrechtlichChangedSig() === true;
        this.updateVisibilityAndDisabledState(
          this.form.controls.identischerZivilrechtlicherWohnsitzPLZ,
          !zivilrechtlichIdentisch,
          this.viewSig().readonly
        );
        this.updateVisibilityAndDisabledState(
          this.form.controls.identischerZivilrechtlicherWohnsitzOrt,
          !zivilrechtlichIdentisch,
          this.viewSig().readonly
        );
        this.form.controls.identischerZivilrechtlicherWohnsitzPLZ.updateValueAndValidity();
        this.form.controls.identischerZivilrechtlicherWohnsitzOrt.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );

    const nationalitaetChangedSig = toSignal(
      this.form.controls.nationalitaet.valueChanges
    );
    effect(
      () => {
        const nationalitaetChanged = nationalitaetChangedSig();
        // If nationality is Switzerland
        if (this.form.controls.nationalitaet.value === this.nationalitaetCH) {
          this.updateVisibilityAndDisabledState(
            this.form.controls.heimatort,
            true,
            this.viewSig().readonly
          );
          this.updateVisibilityAndDisabledState(
            this.form.controls.vormundschaft,
            true,
            this.viewSig().readonly
          );
          this.updateVisbility(this.form.controls.niederlassungsstatus, false, {
            resetOnInvisible: true,
          });
        }
        // No nationality was selected
        else if (nationalitaetChanged === undefined) {
          this.updateVisbility(this.form.controls.niederlassungsstatus, false, {
            resetOnInvisible: true,
          });
          this.updateVisbility(this.form.controls.heimatort, false, {
            resetOnInvisible: true,
          });
          this.updateVisbility(this.form.controls.vormundschaft, false, {
            resetOnInvisible: true,
          });
        }
        // Any other nationality was selected
        else {
          this.updateVisibilityAndDisabledState(
            this.form.controls.niederlassungsstatus,
            true,
            this.viewSig().readonly
          );
          this.updateVisbility(this.form.controls.heimatort, false, {
            resetOnInvisible: true,
          });
          this.updateVisbility(this.form.controls.vormundschaft, false, {
            resetOnInvisible: true,
          });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const { readonly } = this.viewSig();
        if (readonly) {
          Object.values(this.form.controls).forEach((control) =>
            control.disable()
          );
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.store.dispatch(SharedEventGesuchFormPerson.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
  }

  handleSave() {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
    this.updateValidity$.next({});
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormPerson.saveTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: PERSON,
        })
      );
    }
  }

  handleContinue() {
    const { gesuch } = this.viewSig();
    if (gesuch?.id && gesuch?.gesuchTrancheToWorkWith.id) {
      this.store.dispatch(
        SharedEventGesuchFormPerson.nextTriggered({
          id: gesuch.id,
          trancheId: gesuch.gesuchTrancheToWorkWith.id,
          origin: PERSON,
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
    const { gesuch, gesuchFormular } = this.viewSig();
    return {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith?.id,
      gesuchFormular: {
        ...gesuchFormular,
        personInAusbildung: {
          ...convertTempFormToRealValues(this.form, [
            'quellenbesteuert',
            'sozialhilfebeitraege',
          ]),
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
        },
      },
    };
  }

  private updateVisibilityAndDisabledState(
    formControl: FormControl,
    visibile: boolean,
    disabled: boolean,
    opts = { resetOnInvisible: true }
  ): void {
    this.formUtils.setDisabledState(formControl, disabled);
    this.updateVisbility(formControl, visibile, opts);
  }

  private updateVisbility(
    formControl: FormControl,
    visible: boolean,
    opts: { resetOnInvisible: boolean }
  ): void {
    this.hiddenFieldsSetSig.update((hiddenFieldsSet) => {
      if (visible) {
        hiddenFieldsSet.delete(formControl);
      } else {
        hiddenFieldsSet.add(formControl);
        formControl.disable();
        if (opts.resetOnInvisible) {
          formControl.reset();
        }
      }
      return hiddenFieldsSet;
    });
  }
}
