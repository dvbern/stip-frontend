import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungssituation,
  KindDTO,
  WohnsitzGeschwister,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
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
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-kind-editor.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-kind-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormKinderEditorComponent
  implements OnChanges
{
  private formBuilder = inject(NonNullableFormBuilder);

  @Input({ required: true }) kinder!: Partial<KindDTO>;

  @Output() saveTriggered = new EventEmitter<KindDTO>();
  @Output() closeTriggered = new EventEmitter<void>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
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
    wohnsitz: ['', [Validators.required]],
    ausbildungssituation: ['', [Validators.required]],
  });

  ngOnChanges() {
    this.form.patchValue({
      ...this.kinder,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.kinder.geburtsdatum,
        this.languageSig()
      ),
    });
  }

  handleSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.kinder!.id || '',

        geburtsdatum: parseStringAndPrintForBackendLocalDate(
          this.form.getRawValue().geburtsdatum,
          this.languageSig(),
          subYears(new Date(), MEDIUM_AGE)
        )!,
        wohnsitz: this.form.getRawValue().wohnsitz as WohnsitzGeschwister,
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

  protected readonly wohnsitzValues = Object.values(WohnsitzGeschwister);
  protected readonly ausbildungssituationValues =
    Object.values(Ausbildungssituation);
}
