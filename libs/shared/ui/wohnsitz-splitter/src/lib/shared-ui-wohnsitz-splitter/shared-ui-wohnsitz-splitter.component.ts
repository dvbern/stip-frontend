import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiPercentageSplitterComponent } from '@dv/shared/ui/percentage-splitter';
import { SharedUiFormLabelComponent } from '@dv/shared/ui/form';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

type WohnsitzAnteile<T extends string | number> = {
  wohnsitzAnteilVater?: T;
  wohnsitzAnteilMutter?: T;
};

@Component({
  selector: 'dv-shared-ui-wohnsitz-splitter',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiPercentageSplitterComponent,
    SharedUiFormLabelComponent,
    TranslateModule,
  ],
  templateUrl: './shared-ui-wohnsitz-splitter.component.html',
  styleUrls: ['./shared-ui-wohnsitz-splitter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiWohnsitzSplitterComponent {
  @Input({ required: true }) visible!: boolean;

  @Input({ required: true }) controls!: {
    wohnsitzAnteilMutter: FormControl<string | null>;
    wohnsitzAnteilVater: FormControl<string | null>;
  };

  constructor() {
    SharedUiPercentageSplitterComponent.setupPercentDependencies(
      this.controls.wohnsitzAnteilMutter,
      this.controls.wohnsitzAnteilVater
    );
  }

  static numberValues(anteile: Partial<WohnsitzAnteile<string>>) {
    return {
      wohnsitzAnteilMutter:
        SharedUiPercentageSplitterComponent.percentStringToNumber(
          anteile.wohnsitzAnteilMutter
        ),
      wohnsitzAnteilVater:
        SharedUiPercentageSplitterComponent.percentStringToNumber(
          anteile.wohnsitzAnteilVater
        ),
    };
  }

  static stringValues(anteile: Partial<WohnsitzAnteile<number>>) {
    return {
      wohnsitzAnteilMutter:
        SharedUiPercentageSplitterComponent.numberToPercentString(
          anteile.wohnsitzAnteilMutter
        ),
      wohnsitzAnteilVater:
        SharedUiPercentageSplitterComponent.numberToPercentString(
          anteile.wohnsitzAnteilVater
        ),
    };
  }
}
