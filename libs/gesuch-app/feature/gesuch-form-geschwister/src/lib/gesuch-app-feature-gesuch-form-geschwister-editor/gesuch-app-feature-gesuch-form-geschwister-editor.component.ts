import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  addWohnsitzControls,
  wohnsitzAnteileNumber,
  SharedUiWohnsitzSplitterComponent,
  wohnsitzAnteileString,
  updateWohnsitzControlsState,
} from '@dv/shared/ui/wohnsitz-splitter';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungssituation,
  GeschwisterUpdate,
  Wohnsitz,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUtilFormService } from '@dv/shared/util/form';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onDateInputBlur,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { subYears } from 'date-fns';
import { Subject } from 'rxjs';

const MAX_AGE_ADULT = 130;
const MIN_AGE_CHILD = 0;
const MEDIUM_AGE = 20;

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-geschwister-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiFormFieldDirective,
    TranslateModule,
    SharedUiFormMessageErrorDirective,
    NgbInputDatepicker,
    MaskitoModule,
    SharedUiWohnsitzSplitterComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl:
    './gesuch-app-feature-gesuch-form-geschwister-editor.component.html',
  styleUrls: [
    './gesuch-app-feature-gesuch-form-geschwister-editor.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormGeschwisterEditorComponent
  implements OnChanges
{
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);

  @Input({ required: true }) geschwister!: Partial<GeschwisterUpdate>;

  @Output() saveTriggered = new EventEmitter<GeschwisterUpdate>();
  @Output() closeTriggered = new EventEmitter<void>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);
  save$ = new Subject();

  form = this.formBuilder.group({
    nachname: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'date'),
        minDateValidatorForLocale(
          this.languageSig(),
          subYears(new Date(), MAX_AGE_ADULT),
          'date'
        ),
        maxDateValidatorForLocale(
          this.languageSig(),
          subYears(new Date(), MIN_AGE_CHILD),
          'date'
        ),
      ],
    ],
    ...addWohnsitzControls(this.formBuilder),
    ausbildungssituation: this.formBuilder.control<Ausbildungssituation>(
      '' as Ausbildungssituation,
      [Validators.required]
    ),
  });

  wohnsitzChangedSig = toSignal(this.form.controls.wohnsitz.valueChanges);

  showWohnsitzSplitterSig = computed(() => {
    return this.wohnsitzChangedSig() === Wohnsitz.MUTTER_VATER;
  });

  constructor() {
    effect(
      () =>
        updateWohnsitzControlsState(
          this.formUtils,
          this.form.controls,
          !this.showWohnsitzSplitterSig()
        ),
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const wohnsitzChanged = this.wohnsitzChangedSig();

        this.formUtils.setDisabledState(
          this.form.controls.wohnsitzAnteilMutter,
          wohnsitzChanged !== Wohnsitz.MUTTER_VATER,
          true
        );
        this.formUtils.setDisabledState(
          this.form.controls.wohnsitzAnteilVater,
          wohnsitzChanged !== Wohnsitz.MUTTER_VATER,
          true
        );
      },
      { allowSignalWrites: true }
    );
  }

  ngOnChanges() {
    this.form.patchValue({
      ...this.geschwister,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.geschwister.geburtsdatum,
        this.languageSig()
      ),
      ...wohnsitzAnteileString(this.geschwister),
    });
  }

  handleSave() {
    this.save$.next({});
    this.form.markAllAsTouched();
    const geburtsdatum = parseStringAndPrintForBackendLocalDate(
      this.form.getRawValue().geburtsdatum,
      this.languageSig(),
      subYears(new Date(), MEDIUM_AGE)
    );
    if (this.form.valid && geburtsdatum) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.geschwister.id,
        geburtsdatum,
        wohnsitz: this.form.getRawValue().wohnsitz as Wohnsitz,
        ...wohnsitzAnteileNumber(this.form.getRawValue()),
      });
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  handleCancel() {
    this.closeTriggered.emit();
  }

  onGeburtsdatumBlur(_: any) {
    return onDateInputBlur(
      this.form.controls.geburtsdatum,
      subYears(new Date(), MEDIUM_AGE),
      this.languageSig()
    );
  }

  protected readonly wohnsitzValues = Object.values(Wohnsitz);
  protected readonly ausbildungssituationValues =
    Object.values(Ausbildungssituation);
}
