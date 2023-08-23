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
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GesuchAppEventGesuchFormPartner } from '@dv/gesuch-app/event/gesuch-form-partner';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Land,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  PartnerUpdate,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { sharedUtilValidatorAhv } from '@dv/shared/util/validator-ahv';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onDateInputBlur,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { subYears } from 'date-fns';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';
import { selectGesuchAppFeatureGesuchFormPartnerView } from './gesuch-app-feature-gesuch-form-partner.selector';
import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { SharedUiFormCountryComponent } from '@dv/shared/ui/form-country';
import { SharedUtilCountriesService } from '@dv/shared/util/countries';
import {
  fromFormatedNumber,
  maskitoNumber,
} from '@dv/shared/util/maskito-util';
import { SharedUtilFormService } from '@dv/shared/util/form';

const MAX_AGE_ADULT = 130;
const MIN_AGE_ADULT = 10;
const MEDIUM_AGE_ADULT = 30;

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-partner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
    SharedUiFormFieldDirective,
    SharedUiFormCountryComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MaskitoModule,
    NgbInputDatepicker,
    SharedUiFormMessageErrorDirective,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-partner.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-partner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormPartnerComponent implements OnInit {
  private elementRef = inject(ElementRef);
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);
  private countriesService = inject(SharedUtilCountriesService);

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;
  readonly maskitoNumber = maskitoNumber;

  readonly Land = Land;

  languageSig = this.store.selectSignal(selectLanguage);
  view = this.store.selectSignal(selectGesuchAppFeatureGesuchFormPartnerView);
  laenderSig = computed(() => this.view().laender);
  translatedLaender$ = toObservable(this.laenderSig).pipe(
    switchMap((laender) => this.countriesService.getCountryList(laender))
  );

  form = this.formBuilder.group({
    sozialversicherungsnummer: [
      '',
      [Validators.required, sharedUtilValidatorAhv],
    ],
    nachname: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(
      this.formBuilder
    ),
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
    jahreseinkommen: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const { gesuchFormular } = this.view();
      if (gesuchFormular?.partner) {
        const partner = gesuchFormular.partner;
        const partnerForForm = {
          ...partner,
          geburtsdatum: partner.geburtsdatum.toString(),
        };
        this.form.patchValue({
          ...partnerForForm,
          geburtsdatum: parseBackendLocalDateAndPrint(
            partner.geburtsdatum,
            this.languageSig()
          ),
          jahreseinkommen: partnerForForm.jahreseinkommen.toString(),
        });
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormPartner.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormPartner.nextStepTriggered({
          origin: GesuchFormSteps.PARTNER,
          gesuchId,
          gesuchFormular,
        })
      );
    }
  }

  handleSaveAndBack() {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        GesuchAppEventGesuchFormPartner.prevStepTriggered({
          gesuchId,
          gesuchFormular,
          origin: GesuchFormSteps.PARTNER,
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
      subYears(new Date(), MEDIUM_AGE_ADULT),
      this.languageSig()
    );
  }

  private buildUpdatedGesuchFromForm() {
    const { gesuch, gesuchFormular } = this.view();
    const formValues = this.form.getRawValue();
    const partner: PartnerUpdate = {
      ...gesuchFormular?.partner,
      ...formValues,
      adresse: {
        id: gesuchFormular?.partner?.adresse?.id,
        ...formValues.adresse,
      },
      geburtsdatum: parseStringAndPrintForBackendLocalDate(
        formValues.geburtsdatum,
        this.languageSig(),
        subYears(new Date(), MEDIUM_AGE_ADULT)
      )!,
      jahreseinkommen: fromFormatedNumber(formValues.jahreseinkommen) ?? 0,
    };
    return {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        partner,
      },
    };
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
