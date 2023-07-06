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
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungsland,
  AusbildungsPensum,
  AusbildungstaetteDTO,
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
  createDateDependencyValidator,
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onMonthYearInputBlur,
  parseableDateValidatorForLocale,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears, getYear, subMonths } from 'date-fns';
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

  readonly ausbildungslandValues = Object.values(Ausbildungsland);
  readonly ausbildungspensumValues = Object.values(AusbildungsPensum);

  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    ausbildungsland: [<string | null>null, [Validators.required]],
    ausbildungstaette: [<string | null>null, [Validators.required]],
    ausbildungsgang: [<string | null>null, [Validators.required]],
    fachrichtung: [<string | null>null, [Validators.required]],
    ausbildungNichtGefunden: [false, []],
    alternativeAusbildungsgang: [<string | null>null],
    alternativeAusbildungstaette: [<string | null>null],
    ausbildungBegin: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
        minDateValidatorForLocale(
          this.languageSig(),
          subMonths(new Date(), 1),
          'monthYear'
        ),
        maxDateValidatorForLocale(
          this.languageSig(),
          addYears(new Date(), 100),
          'monthYear'
        ),
      ],
    ],
    ausbildungEnd: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
        maxDateValidatorForLocale(
          this.languageSig(),
          addYears(new Date(), 100),
          'monthYear'
        ),
      ],
      [],
    ],
    pensum: [<string | null>null, [Validators.required]],
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
  startChanged$ = toSignal(this.form.controls.ausbildungBegin.valueChanges);
  endChanged$ = toSignal(this.form.controls.ausbildungEnd.valueChanges);

  constructor() {
    // add multi-control validators
    this.form.controls.ausbildungEnd.addValidators([
      createDateDependencyValidator(
        'after',
        this.form.controls.ausbildungBegin,
        true,
        new Date(),
        this.languageSig(),
        'monthYear'
      ),
    ]);
    this.form.controls.ausbildungBegin.addValidators([
      createDateDependencyValidator(
        'before',
        this.form.controls.ausbildungEnd,
        true,
        new Date(),
        this.languageSig(),
        'monthYear'
      ),
    ]);

    // abhaengige Validierung zuruecksetzen on valueChanges
    effect(
      () => {
        this.startChanged$();
        this.form.controls.ausbildungEnd.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.endChanged$();
        this.form.controls.ausbildungBegin.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );

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
          !land$(),
          true
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
          !staette$(),
          true
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
    this.form.controls.ausbildungstaette.reset(null);
    this.form.controls.ausbildungsgang.reset(null);
  }

  handleStaetteChangedByUser() {
    this.form.controls.ausbildungsgang.reset(null);
  }

  handleManuellChangedByUser() {
    this.form.controls.ausbildungstaette.reset(null);
    this.form.controls.ausbildungsgang.reset(null);
    this.form.controls.fachrichtung.reset(null);
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
    this.onDateBlur(this.form.controls.ausbildungBegin);
    this.onDateBlur(this.form.controls.ausbildungEnd);
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

  onDateBlur(ctrl: FormControl) {
    return onMonthYearInputBlur(ctrl, new Date(), this.languageSig());
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
