import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { GesuchAppEventGesuchFormPartner } from '@dv/gesuch-app/event/gesuch-form-partner';
import { sharedUtilValidatorAhv } from '@dv/shared/util/validator-ahv';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import {
  SharedModelGesuch,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  Land,
} from '@dv/shared/model/gesuch';
import { TranslateModule } from '@ngx-translate/core';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
} from '@dv/shared/ui/form';
import { MaskitoModule } from '@maskito/angular';

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
  geburtsdatumMinDate: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  geburtsdatumMaxDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

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
    geburtsdatum: ['', [Validators.required]],
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
        this.form.patchValue({ ...partnerForForm });
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
          ...(this.form.getRawValue() as any),
        },
      },
    } as Partial<SharedModelGesuch>;
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
