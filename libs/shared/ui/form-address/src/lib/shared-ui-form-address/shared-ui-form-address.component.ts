import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
  SharedUiFormMessageInfoDirective,
} from '@dv/shared/ui/form';
import { Land } from '@dv/shared/model/gesuch';

@Component({
  selector: 'dv-shared-ui-form-address',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    SharedUiFormMessageInfoDirective,
  ],
  templateUrl: './shared-ui-form-address.component.html',
  styleUrls: ['./shared-ui-form-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormAddressComponent implements DoCheck {
  @Input({ required: true }) group!: FormGroup;

  @Input({ required: true }) laender!: Land[];

  @Input({ required: true }) language!: string;

  touchedSig = signal(false);

  static buildAddressFormGroup(fb: NonNullableFormBuilder) {
    return fb.group({
      coAdresse: ['', []],
      strasse: ['', [Validators.required]],
      hausnummer: ['', []],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      land: fb.control<Land>('' as Land, {
        validators: Validators.required,
      }),
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  ngDoCheck(): void {
    if (!this.group) {
      return;
    }

    if (this.group.untouched) {
      this.touchedSig.set(false);
    }

    if (this.group.touched) {
      this.touchedSig.set(true);
    }
  }
}
