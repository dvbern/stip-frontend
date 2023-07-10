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
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GesuchAppEventGesuchFormAuszahlung } from '@dv/gesuch-app/event/gesuch-form-auszahlung';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { calculateElternSituationGesuch } from '@dv/gesuch-app/util-fn/gesuch-util';
import { selectLanguage } from '@dv/shared/data-access/language';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import {
  AuszahlungDTO,
  ElternDTO,
  KontoinhaberinType,
  MASK_IBAN,
  PersonInAusbildungDTO,
  SharedModelGesuch,
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
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-auszahlungen.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-auszahlungen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormAuszahlungenComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  MASK_IBAN = MASK_IBAN;
  language = 'de';
  step = GesuchFormSteps.AUSZAHLUNGEN;

  form = this.fb.group({
    kontoinhaberin: [<KontoinhaberinType | null>null, [Validators.required]],
    name: ['', [Validators.required]],
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
      this.form.controls.kontoinhaberin.valueChanges
    );

    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch !== undefined) {
          const initalValue = gesuch.auszahlungContainer?.auszahlungSB || {};
          this.form.patchValue({
            ...initalValue,
            iban: initalValue.iban?.substring(2), // Land-Prefix loeschen
          });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const kontoinhaberin = kontoinhaberinChanges$();
        const { gesuch } = this.view();
        this.language = this.languageSig();
        switch (kontoinhaberin) {
          case KontoinhaberinType.GESUCHSTELLERIN:
            this.setValuesFrom(
              gesuch?.personInAusbildungContainer?.personInAusbildungSB
            );
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.VATER:
            this.setValuesFrom(calculateElternSituationGesuch(gesuch).vater);
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.MUTTER:
            this.setValuesFrom(calculateElternSituationGesuch(gesuch).mutter);
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.ANDERE:
          case KontoinhaberinType.SOZIALDIENST_INSTITUTION:
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
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormAuszahlung.saveTriggered({
          gesuch: this.buildUpdatedGesuchFromForm(),
          origin: GesuchFormSteps.AUSZAHLUNGEN,
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  private setValuesFrom(
    personInAusbildung: PersonInAusbildungDTO | ElternDTO | undefined
  ): void {
    this.form.patchValue(personInAusbildung || {});
  }

  private disableNameAndAdresse(): void {
    this.form.controls.name.disable();
    this.form.controls.vorname.disable();
    this.form.controls.adresse.disable();
  }

  handleKontoinhaberinChangedByUser(): void {
    this.form.controls.name.reset('');
    this.form.controls.vorname.reset('');
    this.form.controls.adresse.reset({});
    this.form.controls.iban.reset('');
  }

  private enableNameAndAdresse(): void {
    this.form.controls.name.enable();
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

  private buildUpdatedGesuchFromForm(): Partial<SharedModelGesuch> {
    const gesuch = this.view().gesuch;
    const auszahlungSB = gesuch?.auszahlungContainer?.auszahlungSB;
    return {
      ...gesuch,
      auszahlungContainer: {
        ...gesuch?.auszahlungContainer,
        auszahlungSB: {
          id: auszahlungSB?.id,
          ...this.form.getRawValue(),
          iban: 'CH' + this.form.getRawValue().iban,
        } as AuszahlungDTO,
      },
    };
  }
}
