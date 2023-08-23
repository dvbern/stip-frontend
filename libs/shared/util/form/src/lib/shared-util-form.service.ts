import { ApplicationRef, ElementRef, Injectable, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilFormService {
  private focusInput$ = new Subject<ElementRef<HTMLElement>>();
  private appRef = inject(ApplicationRef);

  constructor() {
    this.focusInput$
      .pipe(
        switchMap((parent) =>
          // Material components seem to take some time until they are marked as invalid
          this.appRef.isStable.pipe(
            filter((isStable) => isStable),
            take(1),
            map(() => parent)
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe((parent) => {
        const input = parent.nativeElement.querySelector<HTMLElement>(
          'input.ng-invalid, .mat-mdc-select-invalid, .mat-mdc-radio-group.ng-invalid input[type=radio]'
        );
        if (input) {
          input.focus();
          input.scrollIntoView({ block: 'center' });
        }
      });
  }

  focusFirstInvalid(elementRef: ElementRef<HTMLElement>) {
    this.focusInput$.next(elementRef);
  }

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
