import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {LoginForm} from "./login.form";
import {Observable} from "rxjs";

@Component({
  selector: 'stip-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {

  form: LoginForm;

  constructor(
    fb: FormBuilder,
  ) {
    this.form = new LoginForm(fb);
  }

  login(): void {
    if(this.form.group.valid) {

    }
  }

}
