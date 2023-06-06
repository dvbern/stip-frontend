import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedUiProgressBarComponent} from "@dv/shared/ui/progress-bar";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'dv-gesuch-app-feature-eltern',
  standalone: true,
    imports: [CommonModule, SharedUiProgressBarComponent, TranslateModule],
  templateUrl: './gesuch-app-feature-eltern.component.html',
  styleUrls: ['./gesuch-app-feature-eltern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureElternComponent {}
