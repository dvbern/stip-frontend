import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaskitoModule } from '@maskito/angular';
import { Store } from '@ngrx/store';

import {
  GesuchAppDataAccessGesuchFormActions,
  selectGesuchAppDataAccessGesuchsView,
} from '@dv/gesuch-app/data-access/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormMessageComponent,
  SharedUiFormMessageInfoDirective,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { sharedUtilAhvValidator } from '@dv/shared/util/ahv-validator';
import {
  MASK_SOZIALVERSICHERUNGSNUMMER,
  Anrede,
  Land,
  Zivilstand,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  NgbAlert,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-person',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaskitoModule,
    SharedUiProgressBarComponent,
    SharedUiFormFieldComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageInfoDirective,
    SharedUiFormMessageErrorDirective,
    NgbInputDatepicker,
    NgbAlert,
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
      [Validators.required, sharedUtilAhvValidator],
    ],
    anrede: ['', [Validators.required]],
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    addresse: this.formBuilder.group({
      coAdresse: ['', []],
      strasse: ['', [Validators.required]],
      nummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: ['', [Validators.required]],
    }),
    identischerZivilrechtlicherWohnsitz: [false, []],
    email: ['', [Validators.required]],
    telefonnummer: ['', [Validators.required]],
    geburtsdatum: ['', [Validators.required]],
    nationalitaet: ['', [Validators.required]],
    heimatort: ['', [Validators.required]],
    vormundschaft: [false, []],
    zivilstand: ['', [Validators.required]],
    sozialhilfebeitraege: [false, []],
    quellenbesteuerung: [false, []],
    kinder: [false, []],
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
    this.store.dispatch(GesuchAppDataAccessGesuchFormActions.init());
    this.form.valueChanges.subscribe((c) => console.log('debug', c));
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    console.log(this.form.valid, this.form.errors, this.form.controls);
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppDataAccessGesuchFormActions.nextStepTriggered({
          target: 'gesuch-app-feature-gesuch-form-education',
          gesuch: this.buildUpdatedGesuchFromForm(),
        })
      );
    }
  }

  handleSaveAndBack() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppDataAccessGesuchFormActions.prevStepTriggered({
          target: 'gesuch-app-feature-cockpit',
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
          ...(this.form.getRawValue() as any),
        },
      },
    } as Partial<SharedModelGesuch>;
  }
}
