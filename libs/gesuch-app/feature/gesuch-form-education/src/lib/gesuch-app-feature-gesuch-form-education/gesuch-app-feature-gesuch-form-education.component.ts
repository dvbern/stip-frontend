import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {selectGesuchAppDataAccessGesuchsView} from '@dv/gesuch-app/data-access/gesuch';
import {GesuchAppEventGesuchFormEducation} from '@dv/gesuch-app/event/gesuch-form-education';
import {GesuchFormSteps, NavigationType} from '@dv/gesuch-app/model/gesuch-form';
import {Land, SharedModelGesuch} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import {SharedUiProgressBarComponent} from '@dv/shared/ui/progress-bar';
import {Store} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {Subject, takeUntil} from 'rxjs';

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
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-education.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormEducationComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  protected readonly Land = Land;
  private destroy$ = new Subject<void>();
  private initializedForm$ = new Subject<void>();

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  form = this.formBuilder.group({
    ausbildungsland: ['', [Validators.required]],
    ausbildungsstaette: ['', []], // [Validators.required]],
    ausbildungsgang: ['', []], // [Validators.required]],
    fachrichtung: ['', []], // [Validators.required]],
    manuell: [false, []],
    start: ['', []], // [Validators.required]],
    ende: ['', []], // [Validators.required]],
    pensum: [0, []], // [Validators.required]],
  });

  constructor() {
    effect(() => {
      const { gesuch } = this.view();
      if (gesuch?.ausbildung) {
        const ausbildung = gesuch?.ausbildung;
        const ausbildungForForm = {
          ...ausbildung,
          start: ausbildung.start.toString(),
          ende: ausbildung.ende.toString(),
        };
        this.initializedForm$.next();
        this.form.patchValue({ ...ausbildungForForm });

        this.form.controls.manuell.valueChanges
          .pipe(takeUntil(this.initializedForm$), takeUntil(this.destroy$))
          .subscribe((value) => {
            console.log('manuell valueChanges');
            this.form.controls.ausbildungsland.patchValue('');
          });
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormEducation.init());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    console.log(this.form.valid, this.form.errors, this.form.controls);
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEducation.nextStepTriggered({
          origin: GesuchFormSteps.AUSBILDUNG,
          gesuch: this.buildUpdatedGesuchFromForm(),
          navigationType: NavigationType.FORWARDS
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
          navigationType: NavigationType.BACKWARDS
        })
      );
    }
  }

  private buildUpdatedGesuchFromForm() {
    const gesuch = this.view().gesuch;
    return {
      ...gesuch,
      ausbildung: {
        ...(this.form.getRawValue() as any),
      },
    } as Partial<SharedModelGesuch>;
  }

  trackByIndex(index: number) {
    return index;
  }
}
