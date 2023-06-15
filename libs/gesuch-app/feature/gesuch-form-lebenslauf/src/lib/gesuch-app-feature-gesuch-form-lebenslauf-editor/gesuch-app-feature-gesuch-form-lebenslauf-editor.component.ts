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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Bildungsart,
  Kanton,
  LebenslaufItemDTO,
  MASK_MM_YYYY,
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
  createValidatorEndAfterStart,
  createValidatorStartBeforeEnd,
  sharedUtilValidatorMonthYearMax,
  sharedUtilValidatorMonthYearMin,
  sharedUtilValidatorMonthYearMonth,
} from '@dv/shared/util/validator-date';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { getYear } from 'date-fns';

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

  @Input({ required: true }) item!: Partial<LebenslaufItemDTO>;
  @Input({ required: true }) minStartDate?: Date | null;
  @Input({ required: true }) maxEndDate?: Date | null;

  @Output() saveTriggered = new EventEmitter<LebenslaufItemDTO>();
  @Output() autoSaveTriggered = new EventEmitter<LebenslaufItemDTO>();
  @Output() closeTriggered = new EventEmitter<void>();

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    subtype: ['', [Validators.required]],
    dateStart: ['', []],
    dateEnd: ['', []],
    wohnsitz: ['', [Validators.required]],
  });

  startChanged$ = toSignal(this.form.controls.dateStart.valueChanges);
  endChanged$ = toSignal(this.form.controls.dateEnd.valueChanges);

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

  ngOnChanges(changes: SimpleChanges) {
    // update date validators
    if (changes['minStartDate']) {
      this.form.controls.dateStart.clearValidators();
      this.form.controls.dateStart.addValidators([
        Validators.required,
        sharedUtilValidatorMonthYearMonth,
        createValidatorStartBeforeEnd(this.form.controls.dateEnd, true),
        sharedUtilValidatorMonthYearMin(
          getYear(changes['minStartDate'].currentValue)
        ),
      ]);
    }
    if (changes['maxEndDate']) {
      this.form.controls.dateEnd.clearValidators();
      this.form.controls.dateEnd.addValidators([
        Validators.required,
        sharedUtilValidatorMonthYearMonth,
        createValidatorEndAfterStart(this.form.controls.dateStart, true),
        sharedUtilValidatorMonthYearMax(
          getYear(changes['maxEndDate'].currentValue)
        ),
      ]);
    }

    // fill form
    this.form.patchValue(this.item);
  }

  handleSave() {
    /* this.form.controls.dateStart.updateValueAndValidity(); // TODO oder in effect
     this.form.controls.dateEnd.updateValueAndValidity();*/
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // TODO MAKE THE DTO AND FORM MATCH
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

  protected readonly Kanton = Kanton;
  protected readonly Bildungsart = Bildungsart;
  protected readonly Taetigskeitsart = Taetigskeitsart;
  protected readonly MASK_MM_YYYY = MASK_MM_YYYY;
}
