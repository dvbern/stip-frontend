import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Input,
  OnChanges,
  OnInit,
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
  @Input() visible = false;

  @Input({ required: true })
  controlA!: FormControl<string | null>;

  @Input({ required: true })
  controlB!: FormControl<string | null>;

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
  }

  static setupPercentDependencies(
    controlA: FormControl<string | null>,
    controlB: FormControl<string | null>
  ) {
    const controlAChangedSig = toSignal(controlA.valueChanges);
    const controlBChangedSig = toSignal(controlB.valueChanges);

    effect(
      () => {
        const anteilA = this.percentStringToNumber(controlAChangedSig());
        if (anteilA !== undefined && anteilA !== null) {
          controlB.setValue((100 - anteilA)?.toString());
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const anteilB = this.percentStringToNumber(controlBChangedSig());
        if (anteilB !== undefined && anteilB !== null) {
          controlA.setValue((100 - anteilB)?.toString());
        }
      },
      { allowSignalWrites: true }
    );
  }

  static percentStringToNumber(value?: string | null): number | undefined {
    const parsed = parseInt(value || '');
    if (isNaN(parsed)) {
      return undefined;
    } else {
      return parsed;
    }
  }
  static numberToPercentString(value?: number): string {
    return value?.toString() || '';
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
