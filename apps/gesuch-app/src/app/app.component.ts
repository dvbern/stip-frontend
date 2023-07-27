import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectBenutzer } from '@dv/gesuch-app/data-access/gesuch';
// TODO: Remove once login exists
// -----------
import { Benutzer } from '@dv/shared/model/gesuch';
import { filter, switchMap, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GesuchAppEventBenutzer } from '@dv/gesuch-app/event/benutzer';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getBenutzerId } from '@dv/shared/util-fn/local-storage-helper';
// -----------

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'dv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // TODO: Remove once login exists, also remember to remove isNotNull
  // -----------
  private http = inject(HttpClient);
  private store = inject(Store);
  constructor() {
    this.store
      .select(selectBenutzer)
      .pipe(
        filter((benutzer) => benutzer === undefined && !!getBenutzerId()),
        switchMap(() => this.http.get<Benutzer[]>('/api/v1/benutzer')),
        map((benutzers) => benutzers.find((b) => b.id === getBenutzerId())),
        filter(isNotNull),
        takeUntilDestroyed()
      )
      .subscribe((benutzer) =>
        this.store.dispatch(GesuchAppEventBenutzer.setBenutzer(benutzer))
      );
  }
}

const isNotNull = <T, R extends Exclude<T, null | undefined>>(x: T): x is R =>
  x != null;
// -----------
