/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Directive, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControlDirective,
  FormControlName,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
} from '@angular/forms';

type ControlType = FormControlDirective | FormControlName | NgModel;

/**
 * A Directive used to wrap a single value Form control easily
 * https://netbasal.com/forwarding-form-controls-to-custom-control-components-in-angular-701e8406cc55
 */
@Directive({
  selector: '[dvSharedUiFormControlProxy]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SharedUiFormControlProxyDirective,
    },
  ],
  standalone: true,
})
export class SharedUiFormControlProxyDirective implements ControlValueAccessor {
  writeValue(_obj: unknown): void {}
  registerOnChange(_fn: unknown): void {}
  registerOnTouched(_fn: unknown): void {}
}

export function injectTargetControl(): ControlType {
  const ngControl = inject(NgControl, { self: true, optional: true });

  if (!ngControl) throw new Error('Please set formControl or formControlName');

  if (
    ngControl instanceof FormControlDirective ||
    ngControl instanceof FormControlName ||
    ngControl instanceof NgModel
  ) {
    return ngControl;
  }

  throw new Error('No form control handling was possible');
}

export interface ProxyableControl {
  ngControl: ControlType;
}
