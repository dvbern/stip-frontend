import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { gesuchAppPatternGesuchStepNavView } from './gesuch-app-pattern-gesuch-step-nav.selectors';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    SharedUiIconChipComponent,
    RouterLinkActive,
  ],
  templateUrl: './gesuch-app-pattern-gesuch-step-nav.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepNavComponent {
  private store = inject(Store);
  route = inject(Router);

  view$ = this.store.selectSignal(gesuchAppPatternGesuchStepNavView);

  trackByIndex(index: number): number {
    return index;
  }
}
