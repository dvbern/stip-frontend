import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';

@Component({
  selector: 'dv-gesuch-app-feature-cockpit',
  standalone: true,
  imports: [CommonModule, RouterLink, NgFor, TranslateModule],
  templateUrl: './gesuch-app-feature-cockpit.component.html',
  styleUrls: ['./gesuch-app-feature-cockpit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureCockpitComponent implements OnInit {
  private store = inject(Store);

  view = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  ngOnInit() {
    this.store.dispatch(GesuchAppEventCockpit.init());
  }

  handleCreate() {
    this.store.dispatch(GesuchAppEventCockpit.newTriggered());
  }

  handleRemove(id: string) {
    this.store.dispatch(GesuchAppEventCockpit.removeTriggered({ id }));
  }

  trackByIndex(index: number) {
    return index;
  }
}
