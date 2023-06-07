import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import {
  GesuchFormSteps,
  NavigationType,
} from '@dv/gesuch-app/model/gesuch-form';
import { SharedModelGesuch } from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { selectGesuchAppDataAccessAusbildungsgangsView } from '@dv/gesuch-app/data-access/ausbildungsgang';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-education',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiProgressBarComponent,
    TranslateModule,
    ReactiveFormsModule,
    SharedUiFormFieldComponent,
    SharedUiFormMessageComponent,
    SharedUiFormLabelComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiFormLabelTargetDirective,
    NgbInputDatepicker,
    NgbTypeahead,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-education.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormEducationComponent implements OnInit {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    ausbildungsland: ['', [Validators.required]],
    ausbildungsstaette: ['', [Validators.required]],
    ausbildungsgang: ['', [Validators.required]],
    fachrichtung: ['', [Validators.required]],
    manuell: [false, []],
    start: ['', [Validators.required]],
    ende: ['', [Validators.required]],
    pensum: [0, [Validators.required]],
  });

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);
  ausbildungsgangs$ = this.store.selectSignal(
    selectGesuchAppDataAccessAusbildungsgangsView
  );
  land$ = toSignal(this.form.controls.ausbildungsland.valueChanges);
  ausbildungsstaetteOptions$ = computed(() => {
    const ausbildungsgangLands = this.ausbildungsgangs$().ausbildungsgangLands;
    return (
      ausbildungsgangLands.find((item) => item.name === this.land$())
        ?.staettes || []
    );
  });
  ausbildungsstaett$ = toSignal(
    this.form.controls.ausbildungsstaette.valueChanges
  );
  ausbildungsgangOptions$ = computed(() => {
    return (
      this.ausbildungsstaetteOptions$().find(
        (item) => item.name === this.ausbildungsstaett$()
      )?.ausbildungsgangs || []
    );
  });

  constructor() {
    // fill form
    effect(
      () => {
        const { gesuch } = this.view$();
        if (gesuch?.ausbildung?.ausbildungSB) {
          const ausbildung = gesuch?.ausbildung?.ausbildungSB;
          this.form.patchValue({ ...ausbildung });
        }
      },
      { allowSignalWrites: true }
    );

    // When manuell is changed, clear Ausbildungsstaette and Ausbildungsgang
    const manuell$ = toSignal(this.form.controls.manuell.valueChanges);
    effect(
      () => {
        const manuell = manuell$();
        if (manuell !== undefined && manuell === null) {
          // do not reset fields  on signal default value
          this.form.controls.ausbildungsstaette.patchValue(null);
          this.form.controls.ausbildungsgang.patchValue(null);
        }
      },
      { allowSignalWrites: true }
    );

    // When Land is changed (and not in manuell Mode), clear Ausbildungsstaette
    const land$ = toSignal(this.form.controls.ausbildungsland.valueChanges);
    effect(
      () => {
        if (land$() !== undefined && land$() === null) {
          // do not reset fields  on signal default value
          if (!this.form.value.manuell) {
            this.form.controls.ausbildungsstaette.patchValue(null);
          }
        }
      },
      { allowSignalWrites: true }
    );

    // When Land  null, disable staette
    effect(
      () =>
        this.setDisabledState(
          this.form.controls.ausbildungsstaette,
          land$() === null
        ),
      { allowSignalWrites: true }
    );

    // When Ausbildungsstaette is changed (and not in manuell Mode), clear Ausbildungsgang if it is not available
    const staette$ = toSignal(
      this.form.controls.ausbildungsstaette.valueChanges
    );
    effect(() => {
      if (staette$() !== undefined && staette$() === null) {
        if (!this.form.value.manuell) {
          // resetten, wenn Wert nicht in Liste
          const ausbildungsgang = this.form.controls.ausbildungsgang.value;
          const isAusbildungsgangAvailableInOptions =
            this.ausbildungsgangOptions$().find(
              (ag) => ag.name === ausbildungsgang
            );
          if (!isAusbildungsgangAvailableInOptions) {
            this.form.controls.ausbildungsgang.patchValue(null);
          }
        }
      }
    });

    // When Staette null, disable gang
    effect(
      () =>
        this.setDisabledState(
          this.form.controls.ausbildungsgang,
          staette$() === null
        ),
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormEducation.init());
  }

  trackByIndex(index: number) {
    return index;
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    console.log('DEBUG', this.form.valid, this.form.errors, this.form.controls);
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEducation.nextStepTriggered({
          origin: GesuchFormSteps.AUSBILDUNG,
          gesuch: this.buildUpdatedGesuchFromForm(),
          navigationType: NavigationType.FORWARDS,
        })
      );
    }
  }

  handleSaveAndBack() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEducation.prevStepTriggered({
          origin: GesuchFormSteps.AUSBILDUNG,
          gesuch: this.buildUpdatedGesuchFromForm(),
          navigationType: NavigationType.BACKWARDS,
        })
      );
    }
  }

  private buildUpdatedGesuchFromForm() {
    const gesuch = this.view$().gesuch;
    return {
      ...gesuch,
      ausbildung: {
        ausbildungSB: { ...(this.form.getRawValue() as any) },
      },
    } as Partial<SharedModelGesuch>;
  }

  private setDisabledState(control: FormControl, isDisabled: boolean) {
    if (isDisabled) {
      control.disable();
    } else {
      control.enable();
    }
  }
}
