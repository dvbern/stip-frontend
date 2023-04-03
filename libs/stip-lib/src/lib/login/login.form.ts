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

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormBase} from "../angular/forms/form-base";

export class LoginForm extends FormBase {
  constructor(
    fb: FormBuilder,
  ) {
    super(fb);
    this.build();
  }

  private build(): void {
    this.initGroup({
      username: [undefined, Validators.required],
      password: [undefined, Validators.required],
    });
  }
}
