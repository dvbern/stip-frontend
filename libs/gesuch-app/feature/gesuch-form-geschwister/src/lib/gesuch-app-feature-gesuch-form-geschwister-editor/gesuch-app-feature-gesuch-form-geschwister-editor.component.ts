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
  Anrede,
  Ausbildungssituation,
  GeschwisterDTO,
  Wohnsitz,
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
  selector: 'dv-gesuch-app-feature-gesuch-form-geschwister-editor',
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

  @Input({ required: true }) geschwister!: Partial<GeschwisterDTO>;

  @Output() saveTriggered = new EventEmitter<GeschwisterDTO>();
  @Output() closeTriggered = new EventEmitter<void>();

  private store = inject(Store);
  language = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    geburtsdatum: [
      '',
      [
        Validators.required,
        parseableDateValidatorForLocale(this.language(), 'date'),
        minDateValidatorForLocale(
          this.language(),
          subYears(new Date(), MAX_AGE_ADULT),
          'date'
        ),
        maxDateValidatorForLocale(
          this.language(),
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
      ...this.geschwister,
      geburtsdatum: parseBackendLocalDateAndPrint(
        this.geschwister.geburtsdatum,
        this.language()
      ),
    });
  }

  handleSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.saveTriggered.emit({
        ...this.form.getRawValue(),
        id: this.geschwister!.id || '',

        geburtsdatum: parseStringAndPrintForBackendLocalDate(
          this.form.getRawValue().geburtsdatum,
          this.language(),
          subYears(new Date(), MEDIUM_AGE)
        )!,
        wohnsitz: this.form.getRawValue().wohnsitz as Wohnsitz,
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
      this.language()
    );
  }

  protected readonly Anrede = Anrede;
  protected readonly Wohnsitz = Wohnsitz;
  protected readonly Ausbildungssituation = Ausbildungssituation;
}
