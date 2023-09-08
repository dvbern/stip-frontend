import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

import { SharedDataAccessBenutzerApiEvents } from '@dv/shared/data-access/benutzer';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'dv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    const store = inject(Store);
    store.dispatch(SharedDataAccessBenutzerApiEvents.loadCurrentBenutzer());
  }
}
