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

import {Component, ContentChild, Input} from '@angular/core';
import {NgControl} from "@angular/forms";
import {TextInputDirective} from "../text-input.directives";

@Component({
  selector: 'stip-web-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.less'],
})
export class FormControlComponent {

  @Input() label: string | undefined;

  @Input() id: string | undefined;

  control: NgControl | null = null;

  @ContentChild(NgControl, {static: true})
  set ngControl(value: NgControl | null) {
    this.control = value;
  }

  get ngControl(): NgControl | null {
    return this.control;
  }

  @ContentChild(TextInputDirective, {static: true})
  set inputDirective(input: TextInputDirective) {
    if (input !== undefined) {
        this.label = input.label;
        this.id = input.id;
    }
  }
}
