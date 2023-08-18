import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

// TODO: Refactor once services and landing page exist
// -----------
import { Benutzer } from '@dv/shared/model/gesuch';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GesuchAppEventBenutzer } from '@dv/gesuch-app/event/benutzer';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { sharedUtilFnTypeGuardsIsDefined } from '@dv/shared/util-fn/type-guards';
// -----------

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'dv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // TODO: Refactor once services and landing page exist
  // -----------
  private http = inject(HttpClient);
  private store = inject(Store);
  constructor() {
    this.http
      .get<Benutzer>('/api/v1/benutzer/me')
      .pipe(filter(sharedUtilFnTypeGuardsIsDefined), takeUntilDestroyed())
      .subscribe((benutzer) =>
        this.store.dispatch(GesuchAppEventBenutzer.setBenutzer(benutzer))
      );
  }
}
// -----------
