import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  runInInjectionContext,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SharedUiFormComponent,
  SharedUiFormLabelComponent,
  SharedUiFormLabelTargetDirective,
  SharedUiFormMessageComponent,
  SharedUiFormMessageErrorDirective,
} from '@dv/shared/ui/form';
import { maskitoPercent } from '@dv/shared/util/maskito-util';
import { MaskitoModule } from '@maskito/angular';
import { TranslateModule } from '@ngx-translate/core';
import { percentStringToNumber } from '../utils/form';

@Component({
  selector: 'dv-shared-ui-percentage-splitter',
  standalone: true,
  imports: [
    CommonModule,
    MaskitoModule,
    ReactiveFormsModule,
    SharedUiFormComponent,
    SharedUiFormLabelComponent,
    SharedUiFormLabelTargetDirective,
    SharedUiFormMessageComponent,
    SharedUiFormMessageErrorDirective,
    TranslateModule,
  ],
  templateUrl: './shared-ui-percentage-splitter.component.html',
  styleUrls: ['./shared-ui-percentage-splitter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiPercentageSplitterComponent implements OnChanges, OnInit {
  @Input() updateValidity: unknown;
  @Input() visible = false;

  @Input({ required: true })
  controlA!: FormControl<string | undefined>;

  @Input({ required: true })
  controlB!: FormControl<string | undefined>;

  private injector = inject(Injector);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (changes['visible'].currentValue) {
        this.setVisible(this.controlA);
        this.setVisible(this.controlB);
      } else {
        this.setInvisible(this.controlA);
        this.setInvisible(this.controlB);
      }
    }
  }

  public ngOnInit(): void {
    this.ngOnChanges({
      visible: new SimpleChange(null, this.visible, true),
    });
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

  private setInvisible(control: FormControl): void {
    control.patchValue(null);
    control.disable();
  }

  private setVisible(control: FormControl): void {
    control.enable();
  }

  maskitoOptionsPercent = maskitoPercent;
}