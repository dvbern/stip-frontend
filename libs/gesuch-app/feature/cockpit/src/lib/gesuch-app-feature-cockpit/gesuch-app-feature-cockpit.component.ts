import { CommonModule, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchAppPatternGesuchStepNavComponent } from '@dv/gesuch-app/pattern/gesuch-step-nav';
import { GesuchAppPatternMainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';
import {
  selectLanguage,
  SharedDataAccessLanguageEvents,
} from '@dv/shared/data-access/language';
import { Gesuchsperiode } from '@dv/shared/model/gesuch';
import { Language } from '@dv/shared/model/language';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { SharedUiLanguageSelectorComponent } from '@dv/shared/ui/language-selector';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { selectGesuchAppFeatureCockpitView } from './gesuch-app-feature-cockpit.selector';

@Component({
  selector: 'dv-gesuch-app-feature-cockpit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgFor,
    TranslateModule,
    GesuchAppPatternMainLayoutComponent,
    GesuchAppPatternGesuchStepNavComponent,
    SharedUiLanguageSelectorComponent,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    SharedUiIconChipComponent,
    NgbDropdownItem,
  ],
  templateUrl: './gesuch-app-feature-cockpit.component.html',
  styleUrls: ['./gesuch-app-feature-cockpit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureCockpitComponent implements OnInit {
  private store = inject(Store);

  cockpitView = this.store.selectSignal(selectGesuchAppFeatureCockpitView);

  languageSig = this.store.selectSignal(selectLanguage);

  ngOnInit() {
    this.store.dispatch(GesuchAppEventCockpit.init());
  }

  // TODO: Remove once Fall handling exists
  public setFallId(id: string) {
    this.initFall.id = id;
  }

  private initFall = {
    id: '',
    fallNummer: 1,
    mandant: 'bern',
  };

  handleCreate(periode: Gesuchsperiode) {
    this.store.dispatch(
      GesuchAppEventCockpit.newTriggered({
        gesuch: {
          fall: this.initFall,
          gesuchsperiode: periode,
        },
      })
    );
  }

  handleRemove(id: string) {
    this.store.dispatch(GesuchAppEventCockpit.removeTriggered({ id }));
  }

  trackByIndex(index: number) {
    return index;
  }

  handleLanguageChangeHeader(language: Language) {
    this.store.dispatch(
      SharedDataAccessLanguageEvents.headerMenuSelectorChange({ language })
    );
  }
}
