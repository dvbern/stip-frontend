import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from './controls/form-control/form-control.component';
import {TextInputDirective} from "./controls/text-input.directives";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [LoginComponent, FormControlComponent, TextInputDirective],
  exports: [LoginComponent],
})
export class StipLibModule {}
