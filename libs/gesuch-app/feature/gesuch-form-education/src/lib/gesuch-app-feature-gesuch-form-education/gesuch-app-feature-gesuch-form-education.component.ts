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
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import {
  Ausbildungsland,
  AusbildungsPensum,
  AusbildungstaetteDTO,
  MASK_MM_YYYY,
  SharedModelGesuch,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUtilFormService } from '@dv/shared/util/form';
import {
  createValidatorEndAfterStart,
  sharedUtilValidatorMonthYearMin,
  sharedUtilValidatorMonthYearMonth,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getYear } from 'date-fns';
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

import { selectGesuchAppFeatureGesuchFormEducationView } from './gesuch-app-feature-gesuch-form-education.selector';
import { sharedDataAccessStammdatensFeature } from '@dv/shared/data-access/stammdaten';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-education',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbInputDatepicker,
    NgbTypeahead,
    SharedUiFormComponent,
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

  readonly Ausbildungpensum = AusbildungsPensum;

  readonly Ausbildungsland = Ausbildungsland;

  form = this.formBuilder.group({
    ausbildungsland: ['', [Validators.required]],
    ausbildungstaette: ['', [Validators.required]],
    ausbildungsgang: ['', [Validators.required]],
    fachrichtung: ['', [Validators.required]],
    ausbildungNichtGefunden: [false, []],
    ausbildungBegin: [
      '',
      [
        Validators.required,
        sharedUtilValidatorMonthYearMonth,
        sharedUtilValidatorMonthYearMin(this.currentYear),
      ],
    ],
    ausbildungEnd: [
      '',
      [Validators.required, sharedUtilValidatorMonthYearMonth],
      [],
    ],
    pensum: ['', [Validators.required]],
  });

  view$ = this.store.selectSignal(
    selectGesuchAppFeatureGesuchFormEducationView
  );
  land$ = toSignal(this.form.controls.ausbildungsland.valueChanges);
  ausbildungstaetteOptions$ = computed(() => {
    const ausbildungstaettes = this.view$().ausbildungstaettes;
    return ausbildungstaettes.filter(
      (item) => item.ausbildungsland === this.land$()
    );
  });
  ausbildungsstaett$ = toSignal(
    this.form.controls.ausbildungstaette.valueChanges
  );
  ausbildungsgangOptions$ = computed(() => {
    return (
      this.ausbildungstaetteOptions$().find(
        (item) => item.name === this.ausbildungsstaett$()
      )?.ausbildungsgaenge || []
    );
  });

  constructor() {
    // add multi-control validators
    this.form.controls.ausbildungEnd.addValidators([
      createValidatorEndAfterStart(this.form.controls.ausbildungBegin, false),
    ]);

    // fill form
    effect(
      () => {
        const { ausbildung } = this.view$();
        const { ausbildungstaettes } = this.view$();
        if (ausbildung && ausbildungstaettes) {
          this.form.patchValue({
            ...ausbildung,
            ausbildungstaette: ausbildungstaettes?.find(
              (ausbildungstaette) =>
                ausbildungstaette.id === ausbildung.ausbildungstaetteId
            )?.name,
            ausbildungsgang: ausbildungstaettes
              ?.find(
                (ausbildungstaette) =>
                  ausbildungstaette.id === ausbildung.ausbildungstaetteId
              )
              ?.ausbildungsgaenge?.find(
                (ausbildungsgang) =>
                  ausbildungsgang.id === ausbildung.ausbildungsgangId
              )?.id,
          });
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
          this.form.controls.ausbildungstaette,
          !land$()
        );
      },
      { allowSignalWrites: true }
    );

    // When Staette null, disable gang
    const staette$ = toSignal(
      this.form.controls.ausbildungstaette.valueChanges.pipe(
        startWith(this.form.value.ausbildungstaette)
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
    this.form.controls.ausbildungstaette.reset('');
    this.form.controls.ausbildungsgang.reset('');
  }

  handleStaetteChangedByUser() {
    this.form.controls.ausbildungsgang.reset('');
  }

  handleManuellChangedByUser() {
    this.form.controls.ausbildungstaette.reset('');
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
      ausbildungContainer: {
        ausbildungSB: {
          ...(this.form.getRawValue() as any),
          ausbildungstaetteId: this.ausbildungstaetteOptions$()
            .filter(
              (ausbildungstaette) =>
                ausbildungstaette.name ===
                this.form.controls.ausbildungstaette.value
            )
            .pop()?.id,
          ausbildungsgangId: this.form.controls.ausbildungsgang.value,
        },
      },
    } as Partial<SharedModelGesuch>;
  }

  // the typeahead function needs to be a computed because it needs to change when the available options$ change.
  ausbildungstaetteTypeaheadFn$: Signal<
    OperatorFunction<string, readonly any[]>
  > = computed(() => {
    return this.createAusbildungstaetteTypeaheadFn(
      this.ausbildungstaetteOptions$()
    );
  });

  focusAusbildungstaette$ = new Subject<string>();

  createAusbildungstaetteTypeaheadFn(list: AusbildungstaetteDTO[]) {
    console.log('computing typeaheading function for list ', list);
    return (text$: Observable<string>) => {
      const debouncedText$ = text$.pipe(
        debounceTime(200),
        distinctUntilChanged()
      );
      const inputFocus$ = this.focusAusbildungstaette$;
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

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
