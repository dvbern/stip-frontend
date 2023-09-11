import {
  ChangeDetectionStrategy,
  Component,
  QueryList,
  Signal,
  ViewChildren,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SachbearbeitungAppPatternOverviewLayoutComponent } from '@dv/sachbearbeitung-app/pattern/overview-layout';
import { Gesuchstatus } from '@dv/shared/model/gesuch';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import {
  SharedUiFocusableListItemDirective,
  SharedUiFocusableListDirective,
} from '@dv/shared/ui/focusable-list';
import { SharedDataAccessGesuchEvents } from '@dv/shared/data-access/gesuch';

import { selectSachbearbeitungAppFeatureCockpitView } from './sachbearbeitung-app-feature-cockpit.selector';

type GesuchGroup = {
  status: Gesuchstatus;
  iconName: string;
  count: number;
};

@Component({
  selector: 'dv-sachbearbeitung-app-feature-cockpit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatSortModule,
    SharedUiFocusableListItemDirective,
    SharedUiFocusableListDirective,
    RouterModule,
    A11yModule,
    SharedUiIconChipComponent,
    MatPaginatorModule,
    SachbearbeitungAppPatternOverviewLayoutComponent,
  ],
  templateUrl: './sachbearbeitung-app-feature-cockpit.component.html',
  styleUrls: ['./sachbearbeitung-app-feature-cockpit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SachbearbeitungAppFeatureCockpitComponent {
  private store = inject(Store);

  @ViewChildren(SharedUiFocusableListItemDirective)
  public items?: QueryList<SharedUiFocusableListItemDirective>;
  public displayedColumns: string[] = [
    'fall',
    'sv-nummer',
    'nachname',
    'vorname',
    'geburtsdatum',
    'ort',
    'status',
    'bearbeiter',
    'letzteAktivitaet',
  ];
  public cockpitViewSig = this.store.selectSignal(
    selectSachbearbeitungAppFeatureCockpitView
  );
  public groupsSig: Signal<GesuchGroup[]> = computed(() => {
    const gesucheByStatus = this.cockpitViewSig().gesuche.reduce<
      Record<Gesuchstatus, number>
    >(
      (acc, g) => ({
        ...acc,
        [g.gesuchStatus]: (acc[g.gesuchStatus] ?? 0) + 1,
      }),
      {} as Record<Gesuchstatus, number>
    );
    return [
      {
        status: 'OFFEN' as const,
        iconName: 'error',
        count: gesucheByStatus['OFFEN'] ?? 0,
      },
      {
        status: 'IN_BEARBEITUNG' as const,
        iconName: 'check_box',
        count: gesucheByStatus['IN_BEARBEITUNG'] ?? 0,
      },
    ];
  });

  ngOnInit() {
    this.store.dispatch(SharedDataAccessGesuchEvents.loadAll());
  }

  trackByIndex(index: number) {
    return index;
  }
}
