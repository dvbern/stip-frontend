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
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Bildungsart,
  WohnsitzKanton,
  Taetigskeitsart,
  LebenslaufItemUpdate,
} from '@dv/shared/model/gesuch';
import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
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
  private formBuilder = inject(NonNullableFormBuilder);

  private translateService = inject(TranslateService);

  @Input({ required: true }) item!: Partial<SharedModelLebenslauf>;
  @Input({ required: true }) minStartDate?: Date | null;
  @Input({ required: true }) maxEndDate?: Date | null;

  @Output() saveTriggered = new EventEmitter<LebenslaufItemUpdate>();
  @Output() closeTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<string>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    beschreibung: ['TBD', [Validators.required]],
    subtype: [<string | null>null, [Validators.required]],
    von: ['', []],
    bis: ['', []],
    wohnsitz: this.formBuilder.control<WohnsitzKanton>('' as WohnsitzKanton, [
      Validators.required,
    ]),
  });

  startChanged$ = toSignal(this.form.controls.von.valueChanges);
  endChanged$ = toSignal(this.form.controls.bis.valueChanges);
  kantonValues = this.prepareKantonValues();

  constructor() {
    // abhaengige Validierung zuruecksetzen on valueChanges
    effect(
      () => {
        this.startChanged$();
        this.form.controls.bis.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.endChanged$();
        this.form.controls.von.updateValueAndValidity();
      },
      { allowSignalWrites: true }
    );
  }

  private prepareKantonValues() {
    const kantonValues = Object.values(WohnsitzKanton);

    // remove Ausland befor sort
    const indexAusland = kantonValues.indexOf(WohnsitzKanton.AUSLAND);
    if (indexAusland != -1) {
      kantonValues.splice(indexAusland, 1);
    }
    kantonValues.sort((a, b) =>
      this.translateService
        .instant('shared.kanton.' + a)
        .localeCompare(this.translateService.instant('shared.kanton.' + b))
    );
    //add Ausland after sort
    kantonValues.push(WohnsitzKanton.AUSLAND);
    return kantonValues;
  }

  ngOnChanges(changes: SimpleChanges) {
    // update date validators
    if (changes['minStartDate']) {
      this.form.controls.von.clearValidators();
      this.form.controls.von.addValidators([
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
      ]);
      if (changes['minStartDate'].currentValue) {
        this.form.controls.von.addValidators([
          minDateValidatorForLocale(
            this.languageSig(),
            changes['minStartDate'].currentValue,
            'monthYear'
          ),
        ]);
      }
    }
    if (changes['maxEndDate']) {
      this.form.controls.bis.clearValidators();
      this.form.controls.bis.addValidators([
        Validators.required,
        parseableDateValidatorForLocale(this.languageSig(), 'monthYear'),
        createDateDependencyValidator(
          'after',
          this.form.controls.von,
          false,
          new Date(),
          this.languageSig(),
          'monthYear'
        ),
      ]);
      if (changes['maxEndDate'].currentValue) {
        this.form.controls.bis.addValidators([
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
    /* this.form.controls.von.updateValueAndValidity(); // TODO oder in effect
     this.form.controls.bis.updateValueAndValidity();*/
    this.form.markAllAsTouched();
    this.onDateBlur(this.form.controls.von);
    this.onDateBlur(this.form.controls.bis);
    if (this.form.valid) {
      this.saveTriggered.emit({
        id: this.item?.id,
        ...this.form.getRawValue(),
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
