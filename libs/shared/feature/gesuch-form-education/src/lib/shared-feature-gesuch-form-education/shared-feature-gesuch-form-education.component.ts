import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
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

import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { GesuchFormSteps } from '@dv/shared/model/gesuch-form';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import { AusbildungsPensum, Ausbildungsstaette } from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import {
  convertTempFormToRealValues,
  SharedUtilFormService,
} from '@dv/shared/util/form';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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

import { selectSharedFeatureGesuchFormEducationView } from './shared-feature-gesuch-form-education.selector';

@Component({
  selector: 'dv-shared-feature-gesuch-form-education',
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
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-education.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormEducationComponent implements OnInit {
  private elementRef = inject(ElementRef);
  private store = inject(Store);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);
  private translate = inject(TranslateService);

  readonly ausbildungspensumValues = Object.values(AusbildungsPensum);

  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    ausbildungsstaette: [<string | undefined>undefined, [Validators.required]],
    ausbildungsgang: [<string | undefined>undefined, [Validators.required]],
    fachrichtung: [<string | null>null, [Validators.required]],
    ausbildungNichtGefunden: [false, []],
    alternativeAusbildungsgang: [<string | undefined>undefined],
    alternativeAusbildungsstaette: [<string | undefined>undefined],
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

  view$ = this.store.selectSignal(selectSharedFeatureGesuchFormEducationView);
  ausbildungsstaett$ = toSignal(
    this.form.controls.ausbildungsstaette.valueChanges
  );
  ausbildungsstaettOptionsSig = computed(() => {
    const currentAusbildungsstatte = this.ausbildungsstaett$();
    return currentAusbildungsstatte
      ? this.view$().ausbildungsstaettes.filter((ausbildungsstaette) => {
          this.getTranslatedAusbildungstaetteName(ausbildungsstaette)
            ?.toLowerCase()
            .includes(currentAusbildungsstatte.toLowerCase());
        })
      : this.view$().ausbildungsstaettes;
  });
  ausbildungNichtGefundenChanged$ = toSignal(
    this.form.controls.ausbildungNichtGefunden.valueChanges
  );
  startChanged$ = toSignal(this.form.controls.ausbildungBegin.valueChanges);
  endChanged$ = toSignal(this.form.controls.ausbildungEnd.valueChanges);

  ausbildungsgangOptions$ = computed(() => {
    return (
      this.view$().ausbildungsstaettes.find(
        (ausbildungsstaette) =>
          this.getTranslatedAusbildungstaetteName(ausbildungsstaette) ===
          this.ausbildungsstaett$()
      )?.ausbildungsgaenge ?? []
    );
  });

  // the typeahead function needs to be a computed because it needs to change when the available options$ change.
  ausbildungsstaetteTypeaheadFn$: Signal<
    OperatorFunction<string, readonly any[]>
  > = computed(() => {
    return this.createAusbildungsstaetteTypeaheadFn(
      this.view$().ausbildungsstaettes
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
          const ausbildungsstaette = ausbildungsstaettes.find(
            (ausbildungsstaette) =>
              ausbildungsstaette.ausbildungsgaenge?.find(
                (ausbildungsgang) =>
                  ausbildungsgang.id === ausbildung.ausbildungsgangId
              )
          );
          const ausbildungsgang = ausbildungsstaette?.ausbildungsgaenge?.find(
            (ausbildungsgang) =>
              ausbildungsgang.id === ausbildung?.ausbildungsgangId
          );
          this.form.patchValue({
            ...ausbildung,
            ausbildungsstaette:
              this.getTranslatedAusbildungstaetteName(ausbildungsstaette),
            ausbildungsgang: ausbildungsgang?.id,
          });
        } else {
          this.form.reset();
        }
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
    this.store.dispatch(SharedEventGesuchFormEducation.init());
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
    this.form.controls.ausbildungsstaette.reset();
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
    this.formUtils.focusFirstInvalid(this.elementRef);
    const { gesuchId, gesuchFormular } = this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId) {
      this.store.dispatch(
        SharedEventGesuchFormEducation.saveTriggered({
          origin: GesuchFormSteps.AUSBILDUNG,
          gesuchId,
          gesuchFormular,
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
    const { ausbildungsgang, ausbildungsstaette, ...formValue } =
      convertTempFormToRealValues(this.form, ['fachrichtung', 'pensum']);
    const ret = {
      gesuchId: gesuch?.id,
      gesuchFormular: {
        ...gesuchFormular,
        ausbildung: {
          ...formValue,
          ausbildungsgangId: ausbildungsgang ?? undefined,
        },
      },
    };
    return ret;
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
                  (v) =>
                    this.getTranslatedAusbildungstaetteName(v)
                      ?.toLowerCase()
                      .indexOf(term.toLowerCase()) || 0 > -1
                )
          )
            .map((staette) => this.getTranslatedAusbildungstaetteName(staette))
            .slice(0, 10);
        })
      );
    };
  }

  getTranslatedAusbildungstaetteName(
    staette: Ausbildungsstaette | undefined
  ): string | undefined {
    if (staette === undefined) {
      return undefined;
    }
    return this.translate.currentLang === 'fr'
      ? staette.nameFr
      : staette.nameDe;
  }

  onDateBlur(ctrl: FormControl) {
    return onMonthYearInputBlur(ctrl, new Date(), this.languageSig());
  }

  protected readonly GesuchFormSteps = GesuchFormSteps;
}
