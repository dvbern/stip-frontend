import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  Input,
  OnInit,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaskitoModule } from '@maskito/angular';
import { TranslateModule } from '@ngx-translate/core';
import { maskitoPercent } from '@dv/shared/util/maskito-util';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { percentStringToNumber } from '../utils/form';
@Component({
  selector: 'dv-shared-ui-percentage-splitter',
  standalone: true,
  imports: [
    CommonModule,
    MaskitoModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedUiFormFieldDirective,
    SharedUiFormMessageErrorDirective,
    TranslateModule,
  ],
  templateUrl: './shared-ui-percentage-splitter.component.html',
  styleUrls: ['./shared-ui-percentage-splitter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiPercentageSplitterComponent implements OnInit {
  @Input({ required: true }) updateValidity: unknown;
  @Input({ required: true })
  controlA!: FormControl<string | undefined>;

  @Input({ required: true })
  controlB!: FormControl<string | undefined>;

  private injector = inject(Injector);

  public ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      const controlAChangedSig = toSignal(this.controlA.valueChanges, {
        initialValue: undefined,
      });
      const controlBChangedSig = toSignal(this.controlB.valueChanges, {
        initialValue: undefined,
      });

      this.controlA.addValidators(Validators.minLength(2));
      this.controlB.addValidators(Validators.minLength(2));

      effect(
        () => {
          const anteilA = percentStringToNumber(controlAChangedSig());
          if (anteilA !== undefined && anteilA !== null) {
            this.controlB.setValue((100 - anteilA)?.toString());
            this.controlB.setErrors(null);
          }
        },
        { allowSignalWrites: true }
      );

      effect(
        () => {
          const anteilB = percentStringToNumber(controlBChangedSig());
          if (anteilB !== undefined && anteilB !== null) {
            this.controlA.setValue((100 - anteilB)?.toString());
            this.controlA.setErrors(null);
          }
        },
        { allowSignalWrites: true }
      );
    });
  }

  maskitoOptionsPercent = maskitoPercent;
}
