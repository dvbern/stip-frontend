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
  AbstractControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GesuchAppEventGesuchFormAuszahlung } from '@dv/gesuch-app/event/gesuch-form-auszahlung';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { calculateElternSituationGesuch } from '@dv/gesuch-app/util-fn/gesuch-util';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import {
  ElternUpdate,
  Kontoinhaber,
  MASK_IBAN,
  PersonInAusbildungUpdate,
  SharedModelGesuchFormular,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { MaskitoModule } from '@maskito/angular';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { extractIBAN, ExtractIBANResult } from 'ibantools';
import { selectGesuchAppFeatureGesuchFormAuszahlungenView } from './gesuch-app-feature-gesuch-form-auszahlungen.selector';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-auszahlungen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiProgressBarComponent,
    TranslateModule,
    MaskitoModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    SharedUiFormAddressComponent,
    NgbAlert,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-auszahlungen.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-auszahlungen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormAuszahlungenComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);

  MASK_IBAN = MASK_IBAN;
  language = 'de';
  step = GesuchFormSteps.AUSZAHLUNGEN;

  form = this.fb.group({
    kontoinhaber: this.fb.control<Kontoinhaber>('' as Kontoinhaber, {
      validators: Validators.required,
    }),
    nachname: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(this.fb),
    iban: ['', [Validators.required, this.ibanValidator()]],
  });

  laenderSig = computed(() => {
    return this.view().laender;
  });
  languageSig = this.store.selectSignal(selectLanguage);

  view = this.store.selectSignal(
    selectGesuchAppFeatureGesuchFormAuszahlungenView
  );

  constructor() {
    const kontoinhaberinChanges$ = toSignal(
      this.form.controls.kontoinhaber.valueChanges
    );

    effect(
      () => {
        const { gesuchFormular } = this.view();
        if (gesuchFormular !== undefined) {
          const initalValue = gesuchFormular.auszahlung;
          this.form.patchValue({
            ...initalValue,
            iban: initalValue?.iban?.substring(2), // Land-Prefix loeschen
          });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const kontoinhaberin = kontoinhaberinChanges$();
        const { gesuchFormular } = this.view();
        this.language = this.languageSig();
        switch (kontoinhaberin) {
          case Kontoinhaber.GESUCHSTELLER:
            this.setValuesFrom(gesuchFormular?.personInAusbildung);
            this.disableNameAndAdresse();
            break;
          case Kontoinhaber.VATER:
            this.setValuesFrom(
              calculateElternSituationGesuch(gesuchFormular).vater
            );
            this.disableNameAndAdresse();
            break;
          case Kontoinhaber.MUTTER:
            this.setValuesFrom(
              calculateElternSituationGesuch(gesuchFormular).mutter
            );
            this.disableNameAndAdresse();
            break;
          case Kontoinhaber.ANDERE:
          case Kontoinhaber.SOZIALDIENST_INSTITUTION:
          default:
            this.enableNameAndAdresse();
            break;
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormAuszahlung.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormAuszahlung.saveTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.AUSZAHLUNGEN,
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  private setValuesFrom(
    personInAusbildung: PersonInAusbildungUpdate | ElternUpdate | undefined
  ): void {
    this.form.patchValue(personInAusbildung || {});
  }

  private disableNameAndAdresse(): void {
    this.form.controls.nachname.disable();
    this.form.controls.vorname.disable();
    this.form.controls.adresse.disable();
  }

  handleKontoinhaberinChangedByUser(): void {
    this.form.controls.nachname.reset('');
    this.form.controls.vorname.reset('');
    this.form.controls.adresse.reset({});
    this.form.controls.iban.reset('');
  }

  private enableNameAndAdresse(): void {
    this.form.controls.nachname.enable();
    this.form.controls.vorname.enable();
    this.form.controls.adresse.enable();
  }

  private ibanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return null;
      }
      const extractIBANResult = extractIBAN('CH' + control.value);
      if (extractIBANResult.valid && extractIBANResult.countryCode === 'CH') {
        return null;
      }
      return this.constructIBANValidationErrors(extractIBANResult);
    };
  }

  private constructIBANValidationErrors(extractIBANResult: ExtractIBANResult): {
    invalidIBAN?: boolean;
  } {
    const errorObject: { invalidIBAN?: boolean } = {} as ValidationErrors;

    if (!extractIBANResult.valid) {
      errorObject.invalidIBAN = true;
      return errorObject;
    }

    return errorObject;
  }

  private buildUpdatedGesuchFromForm() {
    const { gesuch, gesuchFormular } = this.view();
    const auszahlung = gesuchFormular?.auszahlung;
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        auszahlung: {
          ...auszahlung,
          ...this.form.getRawValue(),
          iban: 'CH' + this.form.getRawValue().iban,
        },
        freigegeben: gesuchFormular?.freigegeben ?? false,
      },
    };
  }
}
