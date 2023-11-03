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
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { AUSBILDUNG } from '@dv/shared/model/gesuch-form';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungsgang,
  AusbildungsPensum,
  Ausbildungsstaette,
} from '@dv/shared/model/gesuch';
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
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addYears } from 'date-fns';
import { startWith } from 'rxjs';

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

  readonly ausbildungspensumValues = Object.values(AusbildungsPensum);

  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    ausbildungsstaette: [<string | undefined>undefined, [Validators.required]],
    ausbildungsgang: [<string | undefined>undefined, [Validators.required]],
    fachrichtung: [<string | null>null, [Validators.required]],
    ausbildungNichtGefunden: [false, []],
    alternativeAusbildungsgang: [<string | undefined>undefined],
    alternativeAusbildungsstaette: [<string | undefined>undefined],
    ausbildungBegin: ['', []],
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

  viewSig = this.store.selectSignal(selectSharedFeatureGesuchFormEducationView);
  ausbildungsstaette$ = toSignal(
    this.form.controls.ausbildungsstaette.valueChanges
  );
  ausbildungsstaettOptionsSig: Signal<
    (Ausbildungsstaette & { translatedName?: string })[]
  > = computed(() => {
    const currentAusbildungsstaette = this.ausbildungsstaette$();
    const toReturn = currentAusbildungsstaette
      ? this.viewSig().ausbildungsstaettes.filter((ausbildungsstaette) => {
          return this.getTranslatedAusbildungstaetteName(ausbildungsstaette)
            ?.toLowerCase()
            .includes(currentAusbildungsstaette.toLowerCase());
        })
      : this.viewSig().ausbildungsstaettes;
    return toReturn.map((ausbildungsstaette) => {
      return {
        ...ausbildungsstaette,
        translatedName:
          this.getTranslatedAusbildungstaetteName(ausbildungsstaette),
      };
    });
  });
  ausbildungNichtGefundenChanged$ = toSignal(
    this.form.controls.ausbildungNichtGefunden.valueChanges
  );
  startChanged$ = toSignal(this.form.controls.ausbildungBegin.valueChanges);
  endChanged$ = toSignal(this.form.controls.ausbildungEnd.valueChanges);

  ausbildungsgangOptions$: Signal<
    (Ausbildungsgang & { translatedName?: string })[]
  > = computed(() => {
    return (
      this.viewSig()
        .ausbildungsstaettes.find(
          (ausbildungsstaette) =>
            this.getTranslatedAusbildungstaetteName(ausbildungsstaette) ===
            this.ausbildungsstaette$()
        )
        ?.ausbildungsgaenge?.map((ausbildungsgang) => {
          return {
            ...ausbildungsgang,
            translatedName:
              this.getTranslatedAusbildungsgangName(ausbildungsgang),
          };
        }) ?? []
    );
  });

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
    effect(() => {
      const { gesuchsPeriodenStart } = this.viewSig();
      const validators: ValidatorFn[] = [
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
        maxDateValidatorForLocale(
          this.languageSig(),
          addYears(new Date(), 100),
          'monthYear'
        ),
      ];

      if (gesuchsPeriodenStart) {
        validators.push(
          minDateValidatorForLocale(
            this.languageSig(),
            gesuchsPeriodenStart,
            'monthYear'
          )
        );
      }
      this.form.controls.ausbildungBegin.clearValidators();
      this.form.controls.ausbildungBegin.addValidators(validators);
    });
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
        const { ausbildung } = this.viewSig();
        const { ausbildungsstaettes } = this.viewSig();
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
    const staetteSig = toSignal(
      this.form.controls.ausbildungsstaette.valueChanges.pipe(
        startWith(this.form.value.ausbildungsstaette)
      )
    );
    effect(
      () => {
        this.formUtils.setDisabledState(
          this.form.controls.ausbildungsgang,
          !staetteSig() || this.viewSig().readonly,
          !this.viewSig().readonly
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const { readonly } = this.viewSig();
        if (readonly) {
          Object.values(this.form.controls).forEach((control) =>
            control.disable()
          );
        }
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
    const { gesuchId, trancheId, gesuchFormular } =
      this.buildUpdatedGesuchFromForm();
    if (this.form.valid && gesuchId && trancheId) {
      this.store.dispatch(
        SharedEventGesuchFormEducation.saveTriggered({
          origin: AUSBILDUNG,
          gesuchId,
          trancheId,
          gesuchFormular,
        })
      );
    }
  }

  handleContinue() {
    const { gesuch } = this.viewSig();
    if (gesuch?.id) {
      this.store.dispatch(
        SharedEventGesuchFormEducation.nextTriggered({
          id: gesuch.id,
          trancheId: gesuch.gesuchTrancheToWorkWith.id,
          origin: AUSBILDUNG,
        })
      );
    }
  }

  // TODO we should clean up this logic once we have final data structure
  // eg extract to util service (for every form step)
  private buildUpdatedGesuchFromForm() {
    this.onDateBlur(this.form.controls.ausbildungBegin);
    this.onDateBlur(this.form.controls.ausbildungEnd);
    const { gesuch, gesuchFormular } = this.viewSig();
    const { ausbildungsgang, ...formValue } = convertTempFormToRealValues(
      this.form,
      ['fachrichtung', 'pensum']
    );
    const ret = {
      gesuchId: gesuch?.id,
      trancheId: gesuch?.gesuchTrancheToWorkWith.id,
      gesuchFormular: {
        ...gesuchFormular,
        ausbildung: {
          ...formValue,
          ausbildungsgangId: ausbildungsgang ?? undefined,
          ausbildungsstaette: undefined,
        },
      },
    };
    return ret;
  }

  getTranslatedAusbildungstaetteName(
    staette: Ausbildungsstaette | undefined
  ): string | undefined {
    if (staette === undefined) {
      return undefined;
    }
    return this.languageSig() === 'fr' ? staette.nameFr : staette.nameDe;
  }

  onDateBlur(ctrl: FormControl) {
    return onMonthYearInputBlur(ctrl, new Date(), this.languageSig());
  }

  private getTranslatedAusbildungsgangName(
    ausbildungsgang: Ausbildungsgang
  ): string | undefined {
    return this.languageSig() === 'fr'
      ? ausbildungsgang.bezeichnungFr
      : ausbildungsgang.bezeichnungDe;
  }
}
