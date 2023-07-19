import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilFormService {
  setDisabledState(
    control: FormControl,
    isDisabled: boolean,
    clearOnDisable?: boolean,
    options?: { emitEvent: boolean }
  ) {
    if (isDisabled) {
      if (clearOnDisable) {
        control.reset();
      }
      control.disable(options);
    } else {
      control.enable(options);
    }
  }
  setRequired(control: FormControl, required: boolean) {
    if (required) {
      control.addValidators(Validators.required);
    } else {
      control.removeValidators(Validators.required);
    }
    control.updateValueAndValidity();
  }
}
