import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-geschwister',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-geschwister.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-geschwister.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormGeschwisterComponent {
  protected readonly GesuchFormSteps = GesuchFormSteps;
}
