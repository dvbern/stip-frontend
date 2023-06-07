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
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';

import { selectGesuchAppFeatureGesuchFormEducationView } from './gesuch-app-feature-gesuch-form-education.selector';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-education',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbInputDatepicker,
    NgbTypeahead,
    SharedUiProgressBarComponent,
    SharedUiFormFieldComponent,
    SharedUiFormMessageComponent,
    SharedUiFormLabelComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiFormLabelTargetDirective,
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

  view$ = this.store.selectSignal(
    selectGesuchAppFeatureGesuchFormEducationView
  );
  land$ = toSignal(this.form.controls.ausbildungsland.valueChanges);
  ausbildungsstaetteOptions$ = computed(() => {
    const ausbildungsgangLands = this.view$().ausbildungsgangLands;
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
        const { ausbildung } = this.view$();
        if (ausbildung) {
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
        if (manuell !== undefined && manuell === true) {
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
      if (staette$() !== undefined) {
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

  // TODO we should clean up this logic once we have final data structure
  // eg extract to util service (for every form step)
  private buildUpdatedGesuchFromForm() {
    return {
      ...this.view$().gesuch,
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
