import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { SharedUiProgressBarComponent } from '@dv/shared/ui/progress-bar';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-form-steps',
  standalone: true,
  imports: [SharedUiProgressBarComponent],
  templateUrl: './gesuch-app-pattern-gesuch-form-steps.component.html',
  styleUrls: ['./gesuch-app-pattern-gesuch-form-steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchFormStepsComponent {
  private store = inject(Store);

  gesuchView =
    this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);
}
