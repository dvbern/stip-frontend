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
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  WohnsitzKanton,
  Taetigskeitsart,
  LebenslaufItemUpdate,
  LebenslaufAusbildungsArt,
} from '@dv/shared/model/gesuch';
import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
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
  createOverlappingValidator,
  maxDateValidatorForLocale,
  minDateValidatorForLocale,
  onMonthYearInputBlur,
  parseableDateValidatorForLocale,
} from '@dv/shared/util/validator-date';
import { selectSharedFeatureGesuchFormLebenslaufVew } from '../shared-feature-gesuch-form-lebenslauf/shared-feature-gesuch-form-lebenslauf.selector';

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
    MatCheckboxModule,
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

  view$ = this.store.selectSignal(selectSharedFeatureGesuchFormLebenslaufVew);

  form = this.formBuilder.group({
    taetigkeitsBeschreibung: [
      <string | undefined>undefined,
      [Validators.required],
    ],
    bildungsart: [
      <LebenslaufAusbildungsArt | undefined>undefined,
      [Validators.required],
    ],
    berufsbezeichnung: [<string | undefined>undefined, [Validators.required]],
    fachrichtung: [<string | undefined>undefined, [Validators.required]],
    titelDesAbschlusses: [<string | undefined>undefined, [Validators.required]],
    taetigskeitsart: [
      <Taetigskeitsart | undefined>undefined,
      [Validators.required],
    ],
    von: ['', []],
    bis: ['', []],
    wohnsitz: this.formBuilder.control<WohnsitzKanton>('' as WohnsitzKanton, [
      Validators.required,
    ]),
    ausbildungAbgeschlossen: [false, [Validators.required]],
  });

  bildungsartSig = toSignal(this.form.controls.bildungsart.valueChanges);
  startChanged$ = toSignal(this.form.controls.von.valueChanges);
  endChanged$ = toSignal(this.form.controls.bis.valueChanges);
  showBerufsbezeichnungSig = computed(
    () =>
      this.bildungsartSig() === 'EIDGENOESSISCHES_BERUFSATTEST' ||
      this.bildungsartSig() === 'EIDGENOESSISCHES_FAEHIGKEITSZEUGNIS'
  );
  showFachrichtungSig = computed(
    () =>
      this.bildungsartSig() === 'BACHELOR_FACHHOCHSCHULE' ||
      this.bildungsartSig() === 'BACHELOR_HOCHSCHULE_UNI' ||
      this.bildungsartSig() === 'MASTER'
  );
  showTitelDesAbschlussesSig = computed(
    () => this.bildungsartSig() === 'ANDERER_BILDUNGSABSCHLUSS'
  );
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
    effect(
      () => {
        this.formUtils.setDisabledState(
          this.form.controls.berufsbezeichnung,
          !this.showBerufsbezeichnungSig(),
          true
        );
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.formUtils.setDisabledState(
          this.form.controls.fachrichtung,
          !this.showFachrichtungSig(),
          true
        );
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.formUtils.setDisabledState(
          this.form.controls.titelDesAbschlusses,
          !this.showTitelDesAbschlussesSig(),
          true
        );
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const { readonly } = this.view$();
        if (readonly) {
          Object.values(this.form.controls).forEach((control) =>
            control.disable()
          );
        }
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
      if (changes['item'].currentValue) {
        this.form.controls.bildungsart.clearValidators();
        this.form.controls.bildungsart.setValidators([
          this.item.type === 'AUSBILDUNG'
            ? Validators.required
            : Validators.nullValidator,
        ]);
        this.form.controls.taetigskeitsart.clearValidators();
        this.form.controls.taetigskeitsart.setValidators([
          this.item.type === 'TAETIGKEIT'
            ? Validators.required
            : Validators.nullValidator,
        ]);
      }
    }

    // fill form
    this.form.patchValue(this.item);

    if (this.item.von && this.item.bis) {
      this.form.controls.bis.markAsTouched();
    }

    if (this.item.type === 'AUSBILDUNG') {
      this.form.controls.taetigskeitsart.clearValidators();
      this.form.controls.taetigkeitsBeschreibung.clearValidators();
      this.form.controls.bildungsart.setValidators(Validators.required);
    }

    if (this.item.type === 'TAETIGKEIT') {
      this.form.controls.bildungsart.clearValidators();
      this.form.controls.taetigskeitsart.setValidators(Validators.required);
      this.form.controls.taetigkeitsBeschreibung.setValidators(
        Validators.required
      );
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
        ...convertTempFormToRealValues(
          this.form,
          this.item.type === 'AUSBILDUNG'
            ? ['bildungsart', 'wohnsitz', 'ausbildungAbgeschlossen']
            : ['taetigskeitsart', 'taetigkeitsBeschreibung']
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

  protected readonly bildungsartValues = Object.values(
    LebenslaufAusbildungsArt
  );
  protected readonly taetigskeitsartValues = Object.values(Taetigskeitsart);
}
