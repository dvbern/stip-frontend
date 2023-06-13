import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { gesuchAppPatternGesuchStepNavView } from './gesuch-app-pattern-gesuch-step-nav.selectors';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './gesuch-app-pattern-gesuch-step-nav.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-step-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepNavComponent {
  private store = inject(Store);

  view$ = this.store.selectSignal(gesuchAppPatternGesuchStepNavView);

  trackByIndex(index: number): number {
    return index;
  }
}
