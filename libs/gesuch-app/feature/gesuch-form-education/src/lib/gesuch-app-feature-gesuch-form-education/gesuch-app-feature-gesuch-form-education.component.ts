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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { selectGesuchAppDataAccessAusbildungsgangsView } from '@dv/gesuch-app/data-access/ausbildungsgang';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import {
  GesuchFormSteps,
  NavigationType,
} from '@dv/gesuch-app/model/gesuch-form';
import {
  Ausbildungsgang,
  AusbildungsgangLand,
  AusbildungsgangStaette,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  OperatorFunction,
  skip,
  Subject,
} from 'rxjs';

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

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);
  ausbildungsgangs = this.store.selectSignal(
    selectGesuchAppDataAccessAusbildungsgangsView
  );

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

  landChangesSignal = toSignal(this.form.controls.ausbildungsland.valueChanges);
  ausbildungsstaetteOptions = computed(() => {
    const land = this.landChangesSignal();
    const ausbildungsgangLands = this.ausbildungsgangs().ausbildungsgangLands;
    return this.getAvailableAusbildungsstaettesFor(land, ausbildungsgangLands);
  });

  constructor() {
    // fill form
    effect(
      () => {
        const { gesuch } = this.view();
        if (gesuch?.ausbildung?.ausbildungSB) {
          const ausbildung = gesuch?.ausbildung?.ausbildungSB;

          console.log('patching form', ausbildung);
          this.form.patchValue({ ...ausbildung });
        }
      },
      { allowSignalWrites: true }
    );

    // When manuell is changed, clear Ausbildungsstaette and Ausbildungsgang
    const manuellChangesSignal = toSignal(
      this.form.controls.manuell.valueChanges.pipe(
        skip(1) // do not reset fields  on initial data load
      )
    );
    effect(
      () => {
        const manuellChanges = manuellChangesSignal();
        if (manuellChanges !== undefined) {
          // do not reset fields  on signal default value
          this.form.controls.ausbildungsstaette.patchValue('');
          this.form.controls.ausbildungsgang.patchValue('');
        }
      },
      { allowSignalWrites: true }
    );

    // When Land is changed (and not in manuell Mode), clear Ausbildungsstaette
    const landChangesSignal = toSignal(
      this.form.controls.ausbildungsland.valueChanges.pipe(skip(1))
    );
    effect(() => {
      const landChanges = landChangesSignal();
      if (landChanges !== undefined) {
        // do not reset fields  on signal default value

        if (!this.form.controls.manuell) {
          this.form.controls.ausbildungsstaette.patchValue('');
        }
      }
    });

    // When Land  null, disable staette
    const landChangesSignal2 = toSignal(
      this.form.controls.ausbildungsland.valueChanges
    );
    effect(
      () => {
        const landChanges = landChangesSignal2();
        console.log(landChanges, typeof landChanges);
        if (landChanges === null) {
          this.form.controls.ausbildungsstaette.disable();
        } else {
          this.form.controls.ausbildungsstaette.enable();
        }
      },
      { allowSignalWrites: true }
    );

    // When Ausbildungsstaette is changed (and not in manuell Mode), clear Ausbildungsgang if it is not available
    const staetteChangesSignal = toSignal(
      this.form.controls.ausbildungsstaette.valueChanges.pipe(skip(1))
    );
    effect(() => {
      const staetteChanges = staetteChangesSignal();
      console.log('staette changes ', staetteChanges);
      if (staetteChanges !== undefined) {
        if (!this.form.value.manuell) {
          const ausbildungsgang = this.form.controls.ausbildungsgang.value;
          console.log('resetting Ausbildungsgang ', ausbildungsgang);
          // resetten, wenn Wert nicht in Liste
          if (
            !this.getAvailableAusbildungsgangs().find(
              (each) => each.name === ausbildungsgang
            )
          ) {
            this.form.controls.ausbildungsgang.patchValue('');
          }
        }
      }
    });

    // When Staette  null, disable gang
    const staetteChangesSignal2 = toSignal(
      this.form.controls.ausbildungsstaette.valueChanges
    );
    effect(
      () => {
        const staetteChanges = staetteChangesSignal2();
        if (staetteChanges === null) {
          this.form.controls.ausbildungsgang.disable();
        } else {
          this.form.controls.ausbildungsgang.enable();
        }
      },
      { allowSignalWrites: true }
    );
  }

  getAvailablAusbildungsstaettes() {
    return this.getAvailableAusbildungsstaettesFor(
      this.form.get('ausbildungsland')?.value,
      this.ausbildungsgangs().ausbildungsgangLands
    );
  }

  getAvailableAusbildungsstaettesFor(
    land: string | undefined | null,
    ausbildungsgangLands: AusbildungsgangLand[]
  ) {
    return (
      ausbildungsgangLands.find((each) => each.name === land)?.staettes || []
    );
  }

  getAvailableAusbildungsgangsFor(
    land: string | undefined | null,
    ausbildungsStaettes: AusbildungsgangStaette[]
  ) {
    return (
      ausbildungsStaettes.find((each) => each.name === land)
        ?.ausbildungsgangs || []
    );
  }

  getAvailableAusbildungsgangs() {
    return this.getAvailableAusbildungsgangsFor(
      this.form.get('ausbildungsstaette')?.value,
      this.getAvailableAusbildungsstaettesFor(
        this.form.get('ausbildungsland')?.value,
        this.ausbildungsgangs().ausbildungsgangLands
      )
    );
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormEducation.init());
  }

  handleSaveAndContinue() {
    this.form.markAllAsTouched();
    console.log(this.form.valid, this.form.errors, this.form.controls);
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
    const gesuch = this.view().gesuch;
    return {
      ...gesuch,
      ausbildung: {
        ausbildungSB: { ...(this.form.getRawValue() as any) },
      },
    } as Partial<SharedModelGesuch>;
  }

  trackByIndex(index: number) {
    return index;
  }

  focusAusbildungsgang$ = new Subject<string>();
  clickAusbildungsgang$ = new Subject<string>();

  searchAusbildungsgang(
    list: Ausbildungsgang[],
    instance: NgbTypeahead
  ): OperatorFunction<string, readonly string[]> {
    return (text$: Observable<string>) => {
      const debouncedText$ = text$.pipe(
        debounceTime(200),
        distinctUntilChanged()
      );
      const clicksWithClosedPopup$ = this.clickAusbildungsgang$.pipe(
        filter(() => !instance.isPopupOpen())
      );
      const inputFocus$ = this.focusAusbildungsgang$;
      return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
        map((term) =>
          (term === ''
            ? list
            : list.filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
          )
            .map((staette) => staette.name)
            .slice(0, 10)
        )
      );
    };
  }
}
