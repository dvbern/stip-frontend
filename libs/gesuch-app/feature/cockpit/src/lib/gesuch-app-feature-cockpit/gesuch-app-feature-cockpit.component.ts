import { CommonModule, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import {GesuchFormSteps} from '@dv/gesuch-app/model/gesuch-form';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { selectGesuchAppFeatureCockpitView } from './gesuch-app-feature-cockpit.selector';

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

  cockpitView = this.store.selectSignal(selectGesuchAppFeatureCockpitView);

  ngOnInit() {
    this.store.dispatch(GesuchAppEventCockpit.init());
  }

  handleCreate(periodeId: string) {
    this.store.dispatch(GesuchAppEventCockpit.newTriggered({ periodeId, origin: GesuchFormSteps.COCKPIT }));
  }

  handleRemove(id: string) {
    this.store.dispatch(GesuchAppEventCockpit.removeTriggered({ id }));
  }

  trackByIndex(index: number) {
    return index;
  }
}
