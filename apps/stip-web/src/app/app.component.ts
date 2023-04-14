import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {StipLibModule} from "@stip-web/stip-lib";
import {StipModelsModule} from "@stip-web/stip-models";
import {Select, Store} from "@ngxs/store";
import {ConfigState} from "../../../../libs/stip-lib/src/lib/store/state/config.state";
import {Observable} from "rxjs";
import {DeploymentConfigDTO} from "../../../../libs/stip-models/src/lib/generated";
import {CommonModule} from "@angular/common";

@Component({
  standalone: true,
    imports: [RouterModule, StipLibModule, StipModelsModule, CommonModule],
  selector: 'stip-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'stip-web';

  @Select(ConfigState.deploymentConfig) config$!: Observable<DeploymentConfigDTO | undefined>;

  constructor(
    private readonly store: Store,
  ) {
  }
}
