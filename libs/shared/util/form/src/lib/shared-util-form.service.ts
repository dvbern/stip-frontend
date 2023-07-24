import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilFormService {
  /**
   * Used to set the disabled state of the given control
   */
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

  /**
   * Used to add or remove the required validators, validity checks are also triggered afterwards
   */
  setRequired(control: FormControl, required: boolean) {
    if (required) {
      control.addValidators(Validators.required);
    } else {
      control.removeValidators(Validators.required);
    }
    control.updateValueAndValidity();
  }

  /**
   * Convert the value changes from a given control into a signal
   */
  signalFromChanges<R>(
    control: FormControl<R>
  ): ReturnType<typeof toSignal<R | undefined>>;
  /**
   * Convert the value changes from a given control into a signal with default values
   */
  signalFromChanges<R>(
    control: FormControl<R>,
    opts: { useDefault: boolean }
  ): ReturnType<typeof toSignal<R, R>>;
  signalFromChanges<R>(
    control: FormControl<R>,
    opts?: { useDefault?: boolean }
  ) {
    return opts?.useDefault
      ? toSignal<R, R>(control.valueChanges, {
          initialValue: control.defaultValue,
        })
      : toSignal<R>(control.valueChanges);
  }
}
