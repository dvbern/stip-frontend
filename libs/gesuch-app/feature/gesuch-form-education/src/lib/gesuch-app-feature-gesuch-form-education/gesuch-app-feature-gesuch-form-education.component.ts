import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getYear, isAfter } from 'date-fns';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  OperatorFunction,
  startWith,
  Subject,
} from 'rxjs';

import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import {
  AusbildungsgangStaette,
  MASK_MM_YYYY,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { SharedUtilFormService } from '@dv/shared/util/form';
import {
  sharedUtilValidatorMonthYearMin,
  sharedUtilValidatorMonthYearMonth,
} from '@dv/shared/util/validator-date';

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
    SharedUiFormFieldComponent,
    SharedUiFormMessageComponent,
    SharedUiFormLabelComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiFormLabelTargetDirective,
    MaskitoModule,
    GesuchAppPatternGesuchStepLayoutComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-education.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormEducationComponent implements OnInit {
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);
  private formUtils = inject(SharedUtilFormService);
  currentYear = getYear(Date.now());

  form = this.formBuilder.group({
    ausbildungsland: ['', [Validators.required]],
    ausbildungsstaette: ['', [Validators.required]],
    ausbildungsgang: ['', [Validators.required]],
    fachrichtung: ['', [Validators.required]],
    manuell: [false, []],
    start: [
      '',
      [
        Validators.required,
        sharedUtilValidatorMonthYearMonth,
        sharedUtilValidatorMonthYearMin(this.currentYear),
      ],
    ],
    ende: ['', [Validators.required, sharedUtilValidatorMonthYearMonth], []],
    pensum: ['', [Validators.required]],
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

  pensumOptions = ['FULLTIME', 'PARTTIME'];

  constructor() {
    // add multi-control validators
    this.form.controls.ende.addValidators([
      this.createValidatorEndAfterStart(this.form.controls.start),
    ]);

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

    const land$ = toSignal(
      this.form.controls.ausbildungsland.valueChanges.pipe(
        startWith(this.form.value.ausbildungsland)
      )
    );
    // When Land  null, disable staette
    effect(
      () => {
        // do not enable/disable fields  on signal default value
        this.formUtils.setDisabledState(
          this.form.controls.ausbildungsstaette,
          !land$()
        );
      },
      { allowSignalWrites: true }
    );

    // When Staette null, disable gang
    const staette$ = toSignal(
      this.form.controls.ausbildungsstaette.valueChanges.pipe(
        startWith(this.form.value.ausbildungsstaette)
      )
    );
    effect(
      () => {
        this.formUtils.setDisabledState(
          this.form.controls.ausbildungsgang,
          !staette$()
        );
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.store.dispatch(GesuchAppEventGesuchFormEducation.init());
  }

  trackByIndex(index: number) {
    return index;
  }

  // this form is special in that the resetting effect
  // can't be done declarative because it's only the user interaction
  // which should trigger it and not the backed patching of value
  // we would need .valueChangesUser and .valueChangesPatch to make it fully declarative
  handleLandChangedByUser() {
    this.form.controls.ausbildungsstaette.reset('');
    this.form.controls.ausbildungsgang.reset('');
  }

  handleStaetteChangedByUser() {
    this.form.controls.ausbildungsgang.reset('');
  }

  handleManuellChangedByUser() {
    this.form.controls.ausbildungsstaette.reset('');
    this.form.controls.ausbildungsgang.reset('');
  }

  handleSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        GesuchAppEventGesuchFormEducation.saveTriggered({
          origin: GesuchFormSteps.AUSBILDUNG,
          gesuch: this.buildUpdatedGesuchFromForm(),
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

  // the typeahead function needs to be a computed because it needs to change when the available options$ change.
  ausbildungsstaetteTypeaheadFn$: Signal<
    OperatorFunction<string, readonly any[]>
  > = computed(() => {
    return this.createAusbildungsstaetteTypeaheadFn(
      this.ausbildungsstaetteOptions$()
    );
  });

  focusAusbildungsstaette$ = new Subject<string>();

  createAusbildungsstaetteTypeaheadFn(list: AusbildungsgangStaette[]) {
    console.log('computing typeaheading function for list ', list);
    return (text$: Observable<string>) => {
      const debouncedText$ = text$.pipe(
        debounceTime(200),
        distinctUntilChanged()
      );
      const inputFocus$ = this.focusAusbildungsstaette$;
      return merge(debouncedText$, inputFocus$).pipe(
        map((term) => {
          console.log('typeaheading term ', term, list);
          return (
            term === ''
              ? list
              : list.filter(
                  (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
                )
          )
            .map((staette) => staette.name)
            .slice(0, 10);
        })
      );
    };
  }

  protected readonly MASK_MM_YYYY = MASK_MM_YYYY;

  createValidatorEndAfterStart(startControl: FormControl<string | null>) {
    return (control: AbstractControl): ValidationErrors | null => {
      const startValue = startControl.value;
      const endValue = control.value as string;
      if (startValue && endValue) {
        const [startMonth, startYear] = startValue
          .split('.')
          .map((value) => +value);
        const [endMonth, endYear] = endValue.split('.').map((value) => +value);

        const startDate = new Date(startYear, startMonth - 1);
        const endDate = new Date(endYear, endMonth - 1);

        return isAfter(endDate, startDate) ? null : { endDateAfterStart: true };
      }
      return null;
    };
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
