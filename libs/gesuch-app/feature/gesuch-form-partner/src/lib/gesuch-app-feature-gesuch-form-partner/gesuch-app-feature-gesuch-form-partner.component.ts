import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';

import { GesuchAppEventGesuchFormPartner } from '@dv/gesuch-app/event/gesuch-form-partner';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Land,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  PartnerDTO,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { sharedUtilValidatorAhv } from '@dv/shared/util/validator-ahv';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { subYears } from 'date-fns';

const MAX_AGE_ADULT = 120;
const MIN_AGE_ADULT = 16;
const MEDIUM_AGE_ADULT = 40;

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-partner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    MaskitoModule,
    NgbInputDatepicker,
    SharedUiFormMessageErrorDirective,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-partner.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-partner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormPartnerComponent implements OnInit {
  private store = inject(Store);

  private formBuilder = inject(FormBuilder);

  readonly MASK_SOZIALVERSICHERUNGSNUMMER = MASK_SOZIALVERSICHERUNGSNUMMER;

  readonly Land = Land;

  language = this.store.selectSignal(selectLanguage);

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  form = this.formBuilder.group({
    sozialversicherungsnummer: [
      '',
      [Validators.required, sharedUtilValidatorAhv],
    ],
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: this.formBuilder.group({
      coAdresse: ['', []],
      strasse: ['', [Validators.required]],
      nummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: ['', [Validators.required]],
    }),
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.language()),
        minDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MAX_AGE_ADULT)
        ),
        maxDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MIN_AGE_ADULT)
        ),
      ],
    ],
    jahreseinkommen: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const { gesuch } = this.view();
      if (gesuch?.partnerContainer?.partnerSB) {
        const partner = gesuch.partnerContainer.partnerSB;
        const partnerForForm = {
          ...partner,
          geburtsdatum: partner.geburtsdatum.toString(),
        };
        this.form.patchValue({
          ...partnerForForm,
          geburtsdatum: parseBackendLocalDateAndPrint(
            partner.geburtsdatum,
            this.language()
          ),
        });
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormPartner.init());
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormPartner.nextStepTriggered({
          origin: GesuchFormSteps.PARTNER,
          gesuch: this.buildUpdatedGesuchFromForm(),
        })
      );
    }
  }

  handleSaveAndBack() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormPartner.prevStepTriggered({
          origin: GesuchFormSteps.PARTNER,
          gesuch: this.buildUpdatedGesuchFromForm(),
        })
      );
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  private buildUpdatedGesuchFromForm() {
    const gesuch = this.view().gesuch;
    return {
      ...gesuch,
      partnerContainer: {
        ...gesuch?.partnerContainer,
        partnerSB: {
          ...gesuch?.partnerContainer?.partnerSB,
          ...this.form.getRawValue(),
          adresse: {
            id: gesuch!.partnerContainer!.partnerSB!.adresse?.id || '', // TODO wie geht das bei neuen entities?
            ...this.form.getRawValue().adresse,
          },
          geburtsdatum: parseStringAndPrintForBackendLocalDate(
            this.form.getRawValue().geburtsdatum,
            this.language(),
            subYears(new Date(), MEDIUM_AGE_ADULT)
          )!,
        } as PartnerDTO,
      },
    } as Partial<SharedModelGesuch>;
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
