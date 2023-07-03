import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GesuchAppModelGesuchFormStep } from '@dv/gesuch-app/model/gesuch-form';

import { GesuchAppPatternGesuchStepNavComponent } from '@dv/gesuch-app/pattern/gesuch-step-nav';
import { GesuchAppPatternMainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';
import { GesuchAppUtilGesuchFormStepManagerService } from '@dv/gesuch-app/util/gesuch-form-step-manager';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-layout',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepNavComponent,
    SharedUiProgressBarComponent,
    TranslateModule,
    SharedUiIconChipComponent,
    GesuchAppPatternMainLayoutComponent,
    RouterLink,
  ],
  templateUrl: './gesuch-app-pattern-gesuch-step-layout.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepLayoutComponent {
  @Input({ required: true })
  step!: GesuchAppModelGesuchFormStep;

  stepManager = inject(GesuchAppUtilGesuchFormStepManagerService);
}
