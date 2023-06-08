import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilFormService {
  setDisabledState(
    control: FormControl,
    isDisabled: boolean,
    options: { emitEvent: boolean } = { emitEvent: false }
  ) {
    if (isDisabled) {
      control.disable(options);
    } else {
      control.enable(options);
    }
  }
}
