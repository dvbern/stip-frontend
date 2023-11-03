import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SharedEventGesuchFormAuszahlung } from '@dv/shared/event/gesuch-form-auszahlung';
import { AUSZAHLUNGEN } from '@dv/shared/model/gesuch-form';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { calculateElternSituationGesuch } from '@dv/shared/util-fn/gesuch-util';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import { SharedUtilFormService } from '@dv/shared/util/form';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
import {
  ElternUpdate,
  Kontoinhaber,
  MASK_IBAN,
  PersonInAusbildungUpdate,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';

import { extractIBAN, ExtractIBANResult } from 'ibantools';
import { selectSharedFeatureGesuchFormAuszahlungenView } from './shared-feature-gesuch-form-auszahlungen.selector';

@Component({
  selector: 'dv-shared-feature-gesuch-form-auszahlungen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    SharedUiProgressBarComponent,
    TranslateModule,
    MaskitoModule,
    SharedUiFormAddressComponent,
    NgbAlert,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-auszahlungen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormAuszahlungenComponent implements OnInit {
  private elementRef = inject(ElementRef);
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);

  MASK_IBAN = MASK_IBAN;
  language = 'de';
  step = AUSZAHLUNGEN;

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

  view = this.store.selectSignal(selectSharedFeatureGesuchFormAuszahlungenView);

  constructor() {
    const kontoinhaberinChanges$ = toSignal(
      this.form.controls.kontoinhaber.valueChanges
    );

    effect(
      () => {
        const { gesuchFormular } = this.view();
        if (sharedUtilFnTypeGuardsIsDefined(gesuchFormular)) {
          const initalValue = gesuchFormular.auszahlung;
          this.form.patchValue({
            ...initalValue,
            iban: initalValue?.iban?.substring(2), // Land-Prefix loeschen
          });
        } else {
          this.form.reset();
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

    effect(
      () => {
        const { readonly } = this.view();
        if (readonly) {
          Object.values(this.form.controls).forEach((control) =>
            control.disable()
          );
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.store.dispatch(SharedEventGesuchFormAuszahlung.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormAuszahlung.saveTriggered({
          gesuchId,
          trancheId,
          gesuchFormular,
          origin: AUSZAHLUNGEN,
        })
      );
    }
  }

  handleContinue() {
    const { gesuch } = this.view();
    if (gesuch?.id && gesuch?.gesuchTrancheToWorkWith.id) {
      this.store.dispatch(
        SharedEventGesuchFormAuszahlung.nextTriggered({
          id: gesuch.id,
          trancheId: gesuch.gesuchTrancheToWorkWith.id,
          origin: AUSZAHLUNGEN,
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  private setValuesFrom(
    valuesFrom: PersonInAusbildungUpdate | ElternUpdate | undefined
  ): void {
    if (valuesFrom) {
      this.form.patchValue(valuesFrom);
    } else {
      this.form.reset();
    }
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
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        auszahlung: {
          ...auszahlung,
          ...this.form.getRawValue(),
          iban: 'CH' + this.form.getRawValue().iban,
        },
      },
    };
  }
}
