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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Anrede,
  Ausbildungssituation,
  GeschwisterDTO,
  Wohnsitz,
} from '@dv/shared/model/gesuch';
import {
  SharedUiFormFieldComponent,
  SharedUiFormFieldLabelComponent,
  SharedUiFormFieldLabelTargetDirective,
  SharedUiFormFieldMessageComponent,
  SharedUiFormFieldMessageErrorDirective,
} from '@dv/shared/ui/form-field';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-geschwister-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiFormFieldComponent,
    SharedUiFormFieldMessageComponent,
    TranslateModule,
    SharedUiFormFieldMessageErrorDirective,
    SharedUiFormFieldLabelTargetDirective,
    SharedUiFormFieldLabelComponent,
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
  private formBuilder = inject(FormBuilder);

  @Input({ required: true }) geschwister!: Partial<GeschwisterDTO>;

  @Output() saveTriggered = new EventEmitter<GeschwisterDTO>();
  @Output() autoSaveTriggered = new EventEmitter<GeschwisterDTO>();
  @Output() closeTriggered = new EventEmitter<void>();

  geburtsdatumMinDate: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  geburtsdatumMaxDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    vorname: ['', [Validators.required]],
    geburtsdatum: ['', [Validators.required]],
    wohnsitz: ['', [Validators.required]],
    ausbildungssituation: ['', [Validators.required]],
  });

  ngOnChanges() {
    this.form.patchValue(this.geschwister);
  }

  handleSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // TODO MAKE THE DTO AND FORM MATCH
      this.saveTriggered.emit({
        ...(this.form.getRawValue() as any),
        id: this.geschwister?.id,
      });
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  handleCancel() {
    this.closeTriggered.emit();
  }

  protected readonly Anrede = Anrede;
  protected readonly Wohnsitz = Wohnsitz;
  protected readonly Ausbildungssituation = Ausbildungssituation;
}
