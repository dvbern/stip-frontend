import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungsland,
  AusbildungsPensum,
  Ausbildungsstaette,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
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
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears, subMonths } from 'date-fns';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  OperatorFunction,
  startWith,
  Subject,
} from 'rxjs';

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
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MaskitoModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-education.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormEducationComponent implements OnInit {
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);

  readonly ausbildungslandValues = Object.values(Ausbildungsland);
  readonly ausbildungspensumValues = Object.values(AusbildungsPensum);

  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    ausbildungsland: this.formBuilder.control<Ausbildungsland | null>(null, {
      validators: Validators.required,
    }),
    ausbildungsstaette: [<string | null>null, [Validators.required]],
    ausbildungsgang: [<string | undefined>undefined, [Validators.required]],
    fachrichtung: [<string | null>null, [Validators.required]],
    ausbildungNichtGefunden: [false, []],
    alternativeAusbildungsgang: [<string | null>null],
    alternativeAusbildungsstaette: [<string | null>null],
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
    pensum: this.formBuilder.control<AusbildungsPensum | null>(null, {
      validators: Validators.required,
    }),
  });

  view$ = this.store.selectSignal(
    selectGesuchAppFeatureGesuchFormEducationView
  );
  land$ = toSignal(this.form.controls.ausbildungsland.valueChanges);
  ausbildungsstaetteOptions$ = computed(() => {
    const ausbildungsstaettes = this.view$().ausbildungsstaettes;
    return ausbildungsstaettes.filter(
      (item) => item.ausbildungsland === this.land$()
    );
  });
  ausbildungsstaett$ = toSignal(
    this.form.controls.ausbildungsstaette.valueChanges
  );
  ausbildungsstaettOptionsSig = computed(() => {
    const currentAusbildungsstatte = this.ausbildungsstaett$();
    return currentAusbildungsstatte
      ? this.ausbildungsstaetteOptions$().filter((item) =>
          item.name
            .toLowerCase()
            .includes(currentAusbildungsstatte.toLowerCase())
        )
      : this.ausbildungsstaetteOptions$();
  });
  ausbildungNichtGefundenChanged$ = toSignal(
    this.form.controls.ausbildungNichtGefunden.valueChanges
  );
  startChanged$ = toSignal(this.form.controls.ausbildungBegin.valueChanges);
  endChanged$ = toSignal(this.form.controls.ausbildungEnd.valueChanges);

  ausbildungsgangOptions$ = computed(() => {
    return (
      this.ausbildungsstaetteOptions$().find(
        (item) => item.name === this.ausbildungsstaett$()
      )?.ausbildungsgaenge || []
    );
  });
  // the typeahead function needs to be a computed because it needs to change when the available options$ change.
  ausbildungsstaetteTypeaheadFn$: Signal<
    OperatorFunction<string, readonly any[]>
  > = computed(() => {
    return this.createAusbildungsstaetteTypeaheadFn(
      this.ausbildungsstaetteOptions$()
    );
  });

  focusAusbildungsstaette$ = new Subject<string>();
  clickAusbildungstaette$ = new Subject<string>();

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

    // abhaengige Validierung zuruecksetzen on valueChanges
    effect(
      () => {
        const value = this.ausbildungNichtGefundenChanged$();
        const {
          alternativeAusbildungsgang,
          alternativeAusbildungsstaette,
          ausbildungsgang,
          ausbildungsstaette,
        } = this.form.controls;
        this.formUtils.setRequired(alternativeAusbildungsgang, !!value);
        this.formUtils.setRequired(alternativeAusbildungsstaette, !!value);
        this.formUtils.setRequired(ausbildungsgang, !value);
        this.formUtils.setRequired(ausbildungsstaette, !value);
      },
      { allowSignalWrites: true }
    );
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
        const { ausbildungsstaettes } = this.view$();
        if (ausbildung && ausbildungsstaettes) {
          this.form.patchValue({
            ...ausbildung,
            ausbildungsstaette: ausbildungsstaettes?.find(
              (ausbildungsstaette) =>
                ausbildungsstaette.id === ausbildung.ausbildungsstaetteId
            )?.name,
            ausbildungsgang: ausbildungsstaettes
              ?.find(
                (ausbildungsstaette) =>
                  ausbildungsstaette.id === ausbildung.ausbildungsstaetteId
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
          this.form.controls.ausbildungsstaette,
          !land$(),
          true
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
    this.form.controls.ausbildungsstaette.reset();
    this.form.controls.ausbildungsgang.reset();
    this.form.controls.fachrichtung.reset();
  }

  @ViewChild(NgbTypeahead) ausbildungsstaetteTypeahead!: NgbTypeahead;

  clearStaetteTypeahead(inputField: HTMLInputElement) {
    this.form.controls.ausbildungsstaette.setValue('');
    this.handleStaetteChangedByUser();
    this.ausbildungsstaetteTypeahead.dismissPopup();
    inputField.focus();
  }

  handleStaetteChangedByUser() {
    this.form.controls.ausbildungsgang.reset();
    this.form.controls.fachrichtung.reset();
  }

  handleGangChangedByUser() {
    this.form.controls.fachrichtung.reset();
  }

  handleManuellChangedByUser() {
    this.form.controls.ausbildungsstaette.reset();
    this.form.controls.alternativeAusbildungsstaette.reset();
    this.form.controls.ausbildungsgang.reset();
    this.form.controls.alternativeAusbildungsgang.reset();
    this.form.controls.fachrichtung.reset();
  }

  handleSave() {
    this.form.markAllAsTouched();
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      const formValue = this.form.getRawValue();
      this.store.dispatch(
        GesuchAppEventGesuchFormEducation.saveTriggered({
          origin: GesuchFormSteps.AUSBILDUNG,
          gesuchId,
          gesuchFormular: {
            ...gesuchFormular,
            ausbildung: {
              ...gesuchFormular.ausbildung,
              ...formValue,
              // TODO: Find better way to remove unecessary properties
              ...{ ausbildungsstaette: undefined, ausbildungsgang: undefined },
              ausbildungsland: formValue.ausbildungsland!,
              fachrichtung: formValue.fachrichtung!,
              pensum: formValue.pensum!,
              alternativeAusbildungsgang:
                formValue.alternativeAusbildungsgang || undefined,
              alternativeAusbildungsstaette:
                formValue.alternativeAusbildungsstaette || undefined,
            },
          },
        })
      );
    }
  }

  // TODO we should clean up this logic once we have final data structure
  // eg extract to util service (for every form step)
  private buildUpdatedGesuchFromForm() {
    this.onDateBlur(this.form.controls.ausbildungBegin);
    this.onDateBlur(this.form.controls.ausbildungEnd);
    const { gesuch, gesuchFormular } = this.view$();
    const a = {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        ausbildung: {
          ...this.form.getRawValue(),
          ausbildungsstaetteId: this.ausbildungsstaetteOptions$()
            .filter(
              (ausbildungsstaette) =>
                ausbildungsstaette.name ===
                this.form.controls.ausbildungsstaette.value
            )
            .pop()?.id,
          ausbildungsgangId: this.form.controls.ausbildungsgang.value,
        },
      },
    };
    console.log(
      'FORM',
      a,
      this.ausbildungsstaetteOptions$(),
      this.ausbildungsstaetteOptions$().filter(
        (ausbildungsstaette) =>
          ausbildungsstaette.name ===
          this.form.controls.ausbildungsstaette.value
      ),
      this.form.controls.ausbildungsstaette.value
    );
    return a;
  }

  onAusbildungsstaetteTypeaheadSelect(event: NgbTypeaheadSelectItemEvent) {
    // Grund wieso wir (selectItem) verwenden und nicht (change): change wird nicht immer ausgeloest. Dafuer muessen
    // wir hier noch selber pruefen, ob der Wert geaendert hat.
    if (event.item !== this.form.getRawValue().ausbildungsstaette) {
      this.handleStaetteChangedByUser();
    }
  }

  createAusbildungsstaetteTypeaheadFn(list: Ausbildungsstaette[]) {
    console.log('computing typeaheading function for list ', list);
    return (text$: Observable<string>) => {
      const debouncedText$ = text$.pipe(
        debounceTime(200),
        distinctUntilChanged()
      );
      const click$ = this.clickAusbildungstaette$;
      const clicksWithClosedPopup$ = click$.pipe(
        filter(() => !this.ausbildungsstaetteTypeahead.isPopupOpen())
      );
      const focus$ = this.focusAusbildungsstaette$;
      return merge(debouncedText$, focus$, clicksWithClosedPopup$).pipe(
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
