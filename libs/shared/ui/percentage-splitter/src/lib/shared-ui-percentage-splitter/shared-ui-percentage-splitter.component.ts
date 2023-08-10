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
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SharedUiFormFieldDirective,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { maskitoPercent } from '@dv/shared/util/maskito-util';
import { MaskitoModule } from '@maskito/angular';
import { TranslateModule } from '@ngx-translate/core';
import { percentStringToNumber } from '../utils/form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

      effect(
        () => {
          const anteilA = percentStringToNumber(controlAChangedSig());
          if (anteilA !== undefined && anteilA !== null) {
            this.controlB.setValue((100 - anteilA)?.toString());
          }
        },
        { allowSignalWrites: true }
      );

      effect(
        () => {
          const anteilB = percentStringToNumber(controlBChangedSig());
          if (anteilB !== undefined && anteilB !== null) {
            this.controlA.setValue((100 - anteilB)?.toString());
          }
        },
        { allowSignalWrites: true }
      );
    });
  }

  maskitoOptionsPercent = maskitoPercent;
}
