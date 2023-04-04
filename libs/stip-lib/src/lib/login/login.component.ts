import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {LoginForm} from "./login.form";
import {Observable} from "rxjs";
import {BenutzerState} from "../store/state/benutzer.state";
import {BenutzerLoginDTO} from "../../../../stip-models/src/lib/generated";
import {Select, Store} from "@ngxs/store";
import {BenutzerActions} from "../store/actions/benutzer.actions";

@Component({
  selector: 'stip-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {

  form: LoginForm;

  @Select(BenutzerState.currentBenutzer) benutzer$!: Observable<BenutzerLoginDTO | undefined>;

  constructor(
    private readonly store: Store,
    fb: FormBuilder,
  ) {
    this.form = new LoginForm(fb);
  }

  login(): void {
    if(this.form.group.valid) {
        this.store.dispatch(new BenutzerActions.Login(this.form.group.value));
    }
  }

}
