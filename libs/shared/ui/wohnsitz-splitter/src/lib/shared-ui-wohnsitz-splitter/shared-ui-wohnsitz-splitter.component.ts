import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiPercentageSplitterComponent } from '@dv/shared/ui/percentage-splitter';
import { SharedUiFormLabelComponent } from '@dv/shared/ui/form';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

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
  @Input() updateValidity: unknown;
  @Input({ required: true }) visible!: boolean;

  @Input({ required: true }) controls!: {
    wohnsitzAnteilMutter: FormControl<string | undefined>;
    wohnsitzAnteilVater: FormControl<string | undefined>;
  };
}
