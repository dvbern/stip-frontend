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
import { GesuchAppEventGesuchFormPerson } from '@dv/gesuch-app/event/gesuch-form-person';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import {
  Anrede,
  Land,
  MASK_SOZIALVERSICHERUNGSNUMMER,
  PersonInAusbildungDTO,
  SharedModelGesuch,
  Wohnsitz,
  Zivilstand,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
  SharedUiFormMessageInfoDirective,
} from '@dv/shared/ui/form';
import { sharedUtilValidatorAhv } from '@dv/shared/util/validator-ahv';
import { MaskitoModule } from '@maskito/angular';
import {
  NgbAlert,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SharedUiFormAddressComponent } from '@dv/shared/ui/form-address';
import { SharedPatternDocumentUploadComponent } from '@dv/shared/pattern/document-upload';

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
  readonly Land = Land;
  readonly Zivilstand = Zivilstand;
  readonly Wohnsitz = Wohnsitz;

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
    anrede: ['', [Validators.required]],
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    adresse: SharedUiFormAddressComponent.buildAddressFormGroup(
      this.formBuilder
    ),
    identischerZivilrechtlicherWohnsitz: [false, []],
    email: ['', [Validators.required]],
    telefonnummer: ['', [Validators.required]],
    geburtsdatum: ['', [Validators.required]],
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
      if (gesuch?.personInAusbildungContainer?.personInAusbildungSB) {
        const person = gesuch.personInAusbildungContainer.personInAusbildungSB;
        const personForForm = {
          ...person,
          geburtsdatum: person.geburtsdatum.toString(),
        };
        this.form.patchValue({ ...personForForm });
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormPerson.init());
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
          },
        } as PersonInAusbildungDTO,
      },
    } as Partial<SharedModelGesuch>;
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
