import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {StipLibModule} from "@stip-web/stip-lib";
import {StipModelsModule} from "@stip-web/stip-models";
import {Store} from "@ngxs/store";

@Component({
  standalone: true,
    imports: [RouterModule, StipLibModule, StipModelsModule],
  selector: 'stip-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'stip-web';

  constructor(
    private readonly store: Store,
  ) {
  }

  // TODO hier dispatch the event for gettin version and environment
}
