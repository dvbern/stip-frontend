import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaskitoModule } from '@maskito/angular';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { GesuchAppUiStepFormButtonsComponent } from '@dv/shared/ui/step-form-buttons';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Bildungsart,
  WohnsitzKanton,
  Taetigskeitsart,
  LebenslaufItemUpdate,
} from '@dv/shared/model/gesuch';
import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { SharedUtilFormService } from '@dv/shared/util/form';
import {
  createDateDependencyValidator,
  createOverlappingValidator,
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onMonthYearInputBlur,
  parseableDateValidatorForLocale,
} from '@dv/shared/util/validator-date';

@Component({
  selector: 'dv-shared-feature-gesuch-form-lebenslauf-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MaskitoModule,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './shared-feature-gesuch-form-lebenslauf-editor.component.html',
  styleUrls: ['./shared-feature-gesuch-form-lebenslauf-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeatureGesuchFormLebenslaufEditorComponent
  implements OnChanges
{
  private elementRef = inject(ElementRef);
  private formBuilder = inject(NonNullableFormBuilder);
  private formUtils = inject(SharedUtilFormService);
  private translateService = inject(TranslateService);

  @Input({ required: true }) item!: Partial<SharedModelLebenslauf>;
  @Input({ required: true }) ausbildungen!: LebenslaufItemUpdate[];
  @Input({ required: true }) minStartDate?: Date | null;
  @Input({ required: true }) maxEndDate?: Date | null;

  @Output() saveTriggered = new EventEmitter<LebenslaufItemUpdate>();
  @Output() closeTriggered = new EventEmitter<void>();
  @Output() deleteTriggered = new EventEmitter<string>();

  private store = inject(Store);
  languageSig = this.store.selectSignal(selectLanguage);

  form = this.formBuilder.group({
    beschreibung: ['', [Validators.required]],
    bildungsart: this.formBuilder.control<Bildungsart | undefined>(undefined, [
      this.item?.type === 'AUSBILDUNG'
        ? Validators.required
        : Validators.nullValidator,
    ]),
    taetigskeitsart: this.formBuilder.control<Taetigskeitsart | undefined>(
      undefined,
      [
        this.item?.type === 'TAETIGKEIT'
          ? Validators.required
          : Validators.nullValidator,
      ]
    ),
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
    const previousAusbildungen = this.ausbildungen
      .filter((l) => !this.item.id || l.id !== this.item.id)
      .map((a) => [a.von, a.bis] as const);
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
        if (this.item?.type === 'AUSBILDUNG') {
          this.form.controls.bis.addValidators([
            createOverlappingValidator(
              this.form.controls.von,
              previousAusbildungen,
              new Date(),
              'monthYear'
            ),
          ]);
        }
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

    if (this.item.von && this.item.bis) {
      this.form.controls.bis.markAsTouched();
    }
  }

  handleSave() {
    this.form.markAllAsTouched();
    this.formUtils.focusFirstInvalid(this.elementRef);
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
