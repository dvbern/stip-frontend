import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormAuszahlung } from '@dv/gesuch-app/event/gesuch-form-auszahlung';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import {
  Anrede,
  ElternDTO,
  KontoinhaberinType,
  Land,
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
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { extractIBAN, ExtractIBANResult } from 'ibantools';

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
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-auszahlungen.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-auszahlungen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormAuszahlungenComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  KontoinhaberinType = KontoinhaberinType;
  MASK_IBAN = MASK_IBAN;
  Land = Land;
  step = GesuchFormSteps.AUSZAHLUNGEN;

  form = this.fb.group({
    kontoinhaberin: [<KontoinhaberinType | null>null, [Validators.required]],
    name: [''],
    vorname: [''],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(this.fb),
    iban: ['', [Validators.required, this.ibanValidator()]],
  });

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  constructor() {
    const kontoinhaberin$ = toSignal(
      this.form.controls.kontoinhaberin.valueChanges
    );

    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch !== undefined) {
          const initalValue = gesuch.auszahlungContainer?.auszahlungSB || {};
          this.form.patchValue({ ...initalValue });
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const kontoinhaberin = kontoinhaberin$();
        const { gesuch } = this.view();

        switch (kontoinhaberin) {
          case KontoinhaberinType.GESUCHSTELLERIN:
            this.setValuesFrom(
              gesuch?.personInAusbildungContainer?.personInAusbildungSB
            );
            this.disableNameAndAdresse();
            break;
          case KontoinhaberinType.VATER: {
            const vaterContainer = gesuch?.elternContainers.find(
              (container) => container.elternSB?.geschlecht === Anrede.HERR
            );
            this.setValuesFrom(vaterContainer?.elternSB);
            this.disableNameAndAdresse();
            break;
          }
          case KontoinhaberinType.MUTTER: {
            const mutterContainer = gesuch?.elternContainers.find(
              (container) => container.elternSB?.geschlecht === Anrede.FRAU
            );
            this.setValuesFrom(mutterContainer?.elternSB);
            this.disableNameAndAdresse();
            break;
          }
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
  }

  handleSave(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormAuszahlung.saveTriggered({
          gesuch: this.buildBackGesuch(),
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
      const extractIBANResult = extractIBAN(control.value);
      if (extractIBANResult.valid && extractIBANResult.countryCode === 'CH') {
        return null;
      }
      return this.constructIBANValidationErrors(extractIBANResult, control);
    };
  }

  private constructIBANValidationErrors(
    extractIBANResult: ExtractIBANResult,
    control: AbstractControl
  ): {
    invalidIBAN?: boolean;
    invalidCountry?: string;
  } {
    const errorObject: { invalidIBAN?: boolean; invalidCountry?: string } =
      {} as ValidationErrors;

    if (!extractIBANResult.valid) {
      errorObject.invalidIBAN = true;
      return errorObject;
    }

    if (extractIBANResult.countryCode !== 'CH') {
      errorObject.invalidCountry = control.value;
    }

    return errorObject;
  }

  private buildBackGesuch(): Partial<SharedModelGesuch> {
    const gesuch = this.view().gesuch;
    return {
      ...gesuch,
      auszahlungContainer: {
        ...gesuch?.auszahlungContainer,
        auszahlungSB: {
          ...gesuch?.auszahlungContainer?.auszahlungSB,
          ...(this.form.getRawValue() as any),
        },
      },
    };
  }
}
