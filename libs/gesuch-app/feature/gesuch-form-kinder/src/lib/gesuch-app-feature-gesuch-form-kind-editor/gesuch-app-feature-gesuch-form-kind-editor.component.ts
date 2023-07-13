import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { GesuchAppUiPercentageSplitterComponent } from '@dv/gesuch-app/ui/percentage-splitter';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungssituation,
  KindUpdate,
  Wohnsitz,
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

const MAX_AGE_ADULT = 130;
const MIN_AGE_CHILD = 0;
const MEDIUM_AGE = 20;

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-kinder-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormMessageComponent,
    TranslateModule,
    SharedUiFormMessageErrorDirective,
    SharedUiFormLabelTargetDirective,
    SharedUiFormLabelComponent,
    NgbInputDatepicker,
    GesuchAppUiPercentageSplitterComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-kind-editor.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-kind-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormKinderEditorComponent
  implements OnChanges
{
  private formBuilder = inject(NonNullableFormBuilder);

  @Input({ required: true }) kind!: Partial<KindUpdate>;

  @Output() saveTriggered = new EventEmitter<KindUpdate>();
  @Output() closeTriggered = new EventEmitter<void>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

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
    wohnsitz: this.formBuilder.control<Wohnsitz>('' as Wohnsitz, [
      Validators.required,
    ]),
    wohnsitzAnteilMutter: ['', [Validators.required]],
    wohnsitzAnteilVater: ['', [Validators.required]],
    ausbildungssituation: this.formBuilder.control<Ausbildungssituation>(
      '' as Ausbildungssituation,
      [Validators.required]
    ),
  });

  wohnsitzChangedSig = toSignal(this.form.controls.wohnsitz.valueChanges);

  private formUtils = inject(SharedUtilFormService);

  constructor() {
    effect(
      () => {
        const wohnsitzChanged = this.wohnsitzChangedSig();

        this.formUtils.setDisabledState(
          this.form.controls.wohnsitzAnteilMutter,
          wohnsitzChanged !== Wohnsitz.ELTERN,
          true
        );
        this.formUtils.setDisabledState(
          this.form.controls.wohnsitzAnteilVater,
          wohnsitzChanged !== Wohnsitz.ELTERN,
          true
        );
      },
      { allowSignalWrites: true }
    );

    GesuchAppUiPercentageSplitterComponent.setupPercentDependencies(
      this.form.controls.wohnsitzAnteilMutter,
      this.form.controls.wohnsitzAnteilVater
    );
  }

  ngOnChanges() {
    this.form.patchValue({
      ...this.kind,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.kind.geburtsdatum,
        this.languageSig()
      ),
      wohnsitzAnteilMutter:
        GesuchAppUiPercentageSplitterComponent.numberToPercentString(
          this.kind.wohnsitzAnteilMutter
        ),
      wohnsitzAnteilVater:
        GesuchAppUiPercentageSplitterComponent.numberToPercentString(
          this.kind.wohnsitzAnteilVater
        ),
    });
  }

  handleSave() {
    this.form.markAllAsTouched();
    const geburtsdatum = parseStringAndPrintForBackendLocalDate(
      this.form.getRawValue().geburtsdatum,
      this.languageSig(),
      subYears(new Date(), MEDIUM_AGE)
    );
    if (!geburtsdatum) {
      this.form.controls.geburtsdatum.setErrors({ invalid: true });
    } else if (this.form.valid) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.kind?.id,
        geburtsdatum,
        wohnsitzAnteilMutter:
          GesuchAppUiPercentageSplitterComponent.percentStringToNumber(
            this.form.getRawValue().wohnsitzAnteilMutter
          ),
        wohnsitzAnteilVater:
          GesuchAppUiPercentageSplitterComponent.percentStringToNumber(
            this.form.getRawValue().wohnsitzAnteilVater
          ),
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
