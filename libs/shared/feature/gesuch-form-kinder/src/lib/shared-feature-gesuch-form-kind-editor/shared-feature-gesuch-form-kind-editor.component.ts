import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { selectSharedDataAccessGesuchsView } from '@dv/shared/data-access/gesuch';
import {
  addWohnsitzControls,
  wohnsitzAnteileNumber,
  SharedUiWohnsitzSplitterComponent,
  wohnsitzAnteileString,
  updateWohnsitzControlsState,
} from '@dv/shared/ui/wohnsitz-splitter';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungssituation,
  KindUpdate,
  Wohnsitz,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import {
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onDateInputBlur,
  parseableDateValidatorForLocale,
  parseBackendLocalDateAndPrint,
  parseStringAndPrintForBackendLocalDate,
} from '@dv/shared/util/validator-date';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { subYears } from 'date-fns';
import { Subject } from 'rxjs';
import { SharedUtilFormService } from '@dv/shared/util/form';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

const MAX_AGE_ADULT = 130;
const MIN_AGE_CHILD = 0;
const MEDIUM_AGE = 20;

@Component({
  selector: 'dv-shared-feature-gesuch-form-kinder-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiFormFieldDirective,
    TranslateModule,
    SharedUiFormMessageErrorDirective,
    NgbInputDatepicker,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    SharedUiWohnsitzSplitterComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-kind-editor.component.html',
  styleUrls: ['./shared-feature-gesuch-form-kind-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormKinderEditorComponent implements OnChanges {
  private elementRef = inject(ElementRef);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);

  @Input({ required: true }) kind!: Partial<KindUpdate>;

  @Output() saveTriggered = new EventEmitter<KindUpdate>();
  @Output() closeTriggered = new EventEmitter<void>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);
  viewSig = this.store.selectSignal(selectSharedDataAccessGesuchsView);
  updateValidity$ = new Subject();

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

  private wohnsitzChangedSig = toSignal(
    this.form.controls.wohnsitz.valueChanges
  );

  showWohnsitzSplitterSig = computed(() => {
    return this.wohnsitzChangedSig() === Wohnsitz.MUTTER_VATER;
  });

  constructor() {
    effect(
      () => {
        updateWohnsitzControlsState(
          this.formUtils,
          this.form.controls,
          !this.showWohnsitzSplitterSig() || this.viewSig().readonly
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

  ngOnChanges() {
    this.form.patchValue({
      ...this.kind,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.kind.geburtsdatum,
        this.languageSig()
      ),
      ...wohnsitzAnteileString(this.kind),
    });
  }

  handleSave() {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
    this.updateValidity$.next({});
    const geburtsdatum = parseStringAndPrintForBackendLocalDate(
      this.form.getRawValue().geburtsdatum,
      this.languageSig(),
      subYears(new Date(), MEDIUM_AGE)
    );
    if (this.form.valid && geburtsdatum) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.kind?.id,
        geburtsdatum,
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
