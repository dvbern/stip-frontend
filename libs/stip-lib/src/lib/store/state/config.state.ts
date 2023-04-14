/*
 * Copyright (C) 2023 DV Bern AG, Switzerland
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import {
  ConfigurationService,
  DeploymentConfigDTO
} from "../../../../../stip-models/src/lib/generated";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {ConfigActions} from "../actions/config.actions";

interface DeploymentConfigStateModel {
  deploymentConfig: DeploymentConfigDTO | undefined;
}

@State<DeploymentConfigStateModel>({
  name: 'deploymentConfig',
  defaults: {
    deploymentConfig: undefined,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ConfigState {

  constructor(
    private readonly configurationService: ConfigurationService,
  ) {
  }

  @Selector()
  static deploymentConfig(state: DeploymentConfigStateModel): DeploymentConfigDTO | undefined {
    return state.deploymentConfig;
  }

  @Action(ConfigActions.LoadDeploymentConfig)
  onLoadDeploymentConfig(ctx: StateContext<DeploymentConfigStateModel>, action: ConfigActions.LoadDeploymentConfig) {
    this.configurationService.getDeploymentConfig$().subscribe(
      deploymentConfig => ctx.dispatch(new ConfigActions.DeploymentConfigLoaded(deploymentConfig))
    );
  }

  @Action(ConfigActions.DeploymentConfigLoaded)
  onDeploymentConfigLoaded(ctx: StateContext<DeploymentConfigStateModel>, action: ConfigActions.DeploymentConfigLoaded) {
    const state = ctx.getState();
    ctx.setState({
        ...state,
        deploymentConfig: action.deploymentConfig,
      }
    );
  }
}
