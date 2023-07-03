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
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectLanguage } from '@dv/shared/data-access/language';
import {
  Ausbildungssituation,
  GeschwisterDTO,
  Wohnsitz,
  WohnsitzGeschwister,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { maskitoPercent } from '@dv/shared/util/maskito-util';
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
    MaskitoModule,
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
    wohnsitzAnteilMutter: ['', [Validators.required]],
    wohnsitzAnteilVater: ['', [Validators.required]],
    ausbildungssituation: ['', [Validators.required]],
  });

  wohnsitzChangedSig = toSignal(this.form.controls.wohnsitz.valueChanges);
  wohnsitzAnteilVaterChangedSig = toSignal(
    this.form.controls.wohnsitzAnteilVater.valueChanges
  );
  wohnsitzAnteilMutterChangedSig = toSignal(
    this.form.controls.wohnsitzAnteilMutter.valueChanges
  );

  constructor() {
    effect(
      () => {
        const wohnsitzChanged = this.wohnsitzChangedSig();

        if (wohnsitzChanged === WohnsitzGeschwister.MUTTER_VATER) {
          this.setVisible(this.form.controls.wohnsitzAnteilMutter);
          this.setVisible(this.form.controls.wohnsitzAnteilVater);
        } else {
          this.setInvisible(this.form.controls.wohnsitzAnteilMutter);
          this.setInvisible(this.form.controls.wohnsitzAnteilVater);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const anteilMutter = this.percentStringToNumber(
          this.wohnsitzAnteilMutterChangedSig()
        );
        if (anteilMutter !== undefined && anteilMutter !== null) {
          this.form.controls.wohnsitzAnteilVater.setValue(
            (100 - anteilMutter)?.toString()
          );
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const anteilVater = this.percentStringToNumber(
          this.wohnsitzAnteilVaterChangedSig()
        );
        if (anteilVater !== undefined && anteilVater !== null) {
          this.form.controls.wohnsitzAnteilMutter.setValue(
            (100 - anteilVater)?.toString()
          );
        }
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
      wohnsitzAnteilMutter: this.geschwister.wohnsitzAnteilMutter?.toString(),
      wohnsitzAnteilVater: this.geschwister.wohnsitzAnteilVater?.toString(),
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
          this.languageSig(),
          subYears(new Date(), MEDIUM_AGE)
        )!,
        wohnsitz: this.form.getRawValue().wohnsitz as WohnsitzGeschwister,
        wohnsitzAnteilMutter: this.percentStringToNumber(
          this.form.getRawValue().wohnsitzAnteilMutter
        ),
        wohnsitzAnteilVater: this.percentStringToNumber(
          this.form.getRawValue().wohnsitzAnteilVater
        ),
      });
    }
  }

  percentStringToNumber(value?: string): number | undefined {
    const parsed = parseInt(value || '');
    if (isNaN(parsed)) {
      return undefined;
    } else {
      return parsed;
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

  maskitoOptionsPercent = maskitoPercent;

  private setInvisible(control: AbstractControl): void {
    control.patchValue(null);
    control.disable();
  }

  private setVisible(control: AbstractControl): void {
    control.enable();
  }
}
