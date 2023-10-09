import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SharedEventGesuchFormAbschluss } from '@dv/shared/event/gesuch-form-abschluss';
import { SharedDataAccessStammdatenApiEvents } from '@dv/shared/data-access/stammdaten';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-abschluss',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './gesuch-app-feature-gesuch-form-abschluss.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-abschluss.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormAbschlussComponent {
  state: 'NOT_READY' | 'READY_TO_SEND' | 'SUBMITTED' = 'NOT_READY';
  public NOT_READY = 'NOT_READY';
  public READY_TO_SEND = 'READY_TO_SEND';
  public SUBMITTED = 'SUBMITTED';
  private store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(SharedEventGesuchFormAbschluss.init());
    this.store.dispatch(SharedDataAccessStammdatenApiEvents.init());
  }
}
