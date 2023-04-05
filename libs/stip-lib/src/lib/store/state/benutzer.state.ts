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


import {AuthService, BenutzerLoginDTO} from "../../../../../stip-models/src/lib/generated";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {BenutzerActions} from "../actions/benutzer.actions";
import {Injectable} from "@angular/core";

interface BenutzerStateModel {
  currentBenutzer: BenutzerLoginDTO | undefined;
}

@State<BenutzerStateModel>({
  name: 'benutzer',
  defaults: {
    currentBenutzer: undefined,
  },
})
@Injectable({
  providedIn: 'root',
})
export class BenutzerState {

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Selector()
  static currentBenutzer(state: BenutzerStateModel): BenutzerLoginDTO | undefined {
    return state.currentBenutzer;
  }

  @Action(BenutzerActions.Login)
  onLogin(ctx: StateContext<BenutzerStateModel>, action: BenutzerActions.Login) {
    this.authService.login$({benutzerLoginDTO: action.benutzerLogin}).subscribe(
      username => ctx.dispatch(new BenutzerActions.LoginSuccess({
        password: '',
        username: username
      }))
    );
  }

  @Action(BenutzerActions.LoginSuccess)
  onLoginSuccess(ctx: StateContext<BenutzerStateModel>, action: BenutzerActions.LoginSuccess) {
    const state = ctx.getState();
    ctx.setState({
        ...state,
        currentBenutzer: action.benutzerLogin,
      }
    );
  }
}
