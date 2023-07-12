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
  SimpleChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Bildungsart,
  Kanton,
  LebenslaufItemDTO,
  Taetigskeitsart,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import {
  createDateDependencyValidator,
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onMonthYearInputBlur,
  parseableDateValidatorForLocale,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-lebenslauf-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    TranslateModule,
    MaskitoModule,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl:
    './gesuch-app-feature-gesuch-form-lebenslauf-editor.component.html',
  styleUrls: [
    './gesuch-app-feature-gesuch-form-lebenslauf-editor.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormLebenslaufEditorComponent
  implements OnChanges
{
  private formBuilder = inject(FormBuilder);

  private translateService = inject(TranslateService);

  @Input({ required: true }) item!: Partial<LebenslaufItemDTO>;
  @Input({ required: true }) minStartDate?: Date | null;
  @Input({ required: true }) maxEndDate?: Date | null;

  @Output() saveTriggered = new EventEmitter<LebenslaufItemDTO>();
  @Output() closeTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<string>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    subtype: [<string | null>null, [Validators.required]],
    dateStart: ['', []],
    dateEnd: ['', []],
    wohnsitz: [<string | null>null, [Validators.required]],
  });

  startChanged$ = toSignal(this.form.controls.dateStart.valueChanges);
  endChanged$ = toSignal(this.form.controls.dateEnd.valueChanges);
  kantonValues = this.prepareKantonValues();

  constructor() {
    // abhaengige Validierung zuruecksetzen on valueChanges
    effect(
      () => {
        this.startChanged$();
        this.form.controls.dateEnd.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.endChanged$();
        this.form.controls.dateStart.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );
  }

  private prepareKantonValues() {
    const kantonValues = Object.values(Kanton);

    // remove Ausland befor sort
    const indexAusland = kantonValues.indexOf(Kanton.AUSLAND);
    if (indexAusland != -1) {
      kantonValues.splice(indexAusland, 1);
    }
    kantonValues.sort((a, b) =>
      this.translateService
        .instant('shared.kanton.' + a)
        .localeCompare(this.translateService.instant('shared.kanton.' + b))
    );
    //add Ausland after sort
    kantonValues.push(Kanton.AUSLAND);
    return kantonValues;
  }

  ngOnChanges(changes: SimpleChanges) {
    // update date validators
    if (changes['minStartDate']) {
      this.form.controls.dateStart.clearValidators();
      this.form.controls.dateStart.addValidators([
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
      ]);
      if (changes['minStartDate'].currentValue) {
        this.form.controls.dateStart.addValidators([
          minDateValidatorForLocale(
            this.languageSig(),
            changes['minStartDate'].currentValue,
            'monthYear'
          ),
        ]);
      }
    }
    if (changes['maxEndDate']) {
      this.form.controls.dateEnd.clearValidators();
      this.form.controls.dateEnd.addValidators([
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
        createDateDependencyValidator(
          'after',
          this.form.controls.dateStart,
          false,
          new Date(),
          this.languageSig(),
          'monthYear'
        ),
      ]);
      if (changes['maxEndDate'].currentValue) {
        this.form.controls.dateEnd.addValidators([
          maxDateValidatorForLocale(
            this.languageSig(),
            changes['maxEndDate'].currentValue,
            'monthYear'
          ),
        ]);
      }
    }

    // fill form
    this.form.patchValue(this.item);
  }

  handleSave() {
    /* this.form.controls.dateStart.updateValueAndValidity(); // TODO oder in effect
     this.form.controls.dateEnd.updateValueAndValidity();*/
    this.form.markAllAsTouched();
    this.onDateBlur(this.form.controls.dateStart);
    this.onDateBlur(this.form.controls.dateEnd);
    if (this.form.valid) {
      this.saveTriggered.emit({
        id: this.item?.id,
        type: this.item?.type,
        ...(this.form.getRawValue() as any),
      });
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  handleCancel() {
    this.closeTriggered.emit();
  }

  handleDelete() {
    if (this.item?.id) {
      this.deleteTriggered.emit(this.item!.id);
    }
  }

  onDateBlur(ctrl: FormControl) {
    return onMonthYearInputBlur(
      ctrl,
      this.minStartDate || new Date(),
      this.languageSig()
    );
  }

  protected readonly bildungsartValues = Object.values(Bildungsart);
  protected readonly taetigskeitsartValues = Object.values(Taetigskeitsart);
}
