import { CommonModule, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { Fall, Gesuchsperiode } from '@dv/shared/model/gesuch';
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

// TODO: Refactor once services and landing page exist
// -----
import { HttpClient } from '@angular/common/http';
import { filter, map, switchMap } from 'rxjs/operators';
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
import { KeycloakService } from 'keycloak-angular';
import { selectCurrentBenutzer } from '@dv/shared/data-access/benutzer';
// -----

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
  private benutzerSig = this.store.selectSignal(selectCurrentBenutzer);
  private keyCloakService = inject(KeycloakService);

  // TODO: Refactor once services and landing page exist
  // -----
  private http = inject(HttpClient);
  fall$ = this.store.select(selectCurrentBenutzer).pipe(
    filter(sharedUtilFnTypeGuardsIsDefined),
    switchMap((benutzer) => {
      const fallUrl = `/api/v1/fall/benutzer/${benutzer.id}`;
      return this.http.get<Fall[]>(fallUrl).pipe(
        switchMap((falls) =>
          falls.length === 0
            ? this.http.post(fallUrl, {}).pipe(
                switchMap(() => this.http.get<Fall[]>(fallUrl)),
                map((falls) => falls[0])
              )
            : [falls[0]]
        )
      );
    })
  );
  // -----

  cockpitView = this.store.selectSignal(selectGesuchAppFeatureCockpitView);
  // Do not initialize signals in computed directly, just usage
  benutzerNameSig = computed(() => {
    const benutzer = this.benutzerSig();
    return `${benutzer?.vorname} ${benutzer?.nachname}`;
  });

  languageSig = this.store.selectSignal(selectLanguage);

  ngOnInit() {
    this.store.dispatch(GesuchAppEventCockpit.init());
  }

  handleCreate(periode: Gesuchsperiode, fallId: string) {
    this.store.dispatch(
      GesuchAppEventCockpit.newTriggered({
        create: {
          fallId,
          gesuchsperiodeId: periode.id,
        },
      })
    );
  }

  handleRemove(id: string) {
    this.store.dispatch(GesuchAppEventCockpit.removeTriggered({ id }));
  }

  trackByPerioden(
    _index: number,
    periode: Gesuchsperiode & { gesuchLoading: boolean }
  ) {
    return periode.id + periode.gesuchLoading;
  }

  trackByIndex(index: number) {
    return index;
  }

  logout() {
    this.keyCloakService.logout();
  }

  handleLanguageChangeHeader(language: Language) {
    this.store.dispatch(
      SharedDataAccessLanguageEvents.headerMenuSelectorChange({ language })
    );
  }
}
