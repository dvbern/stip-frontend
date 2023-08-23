import {
  AfterViewInit,
  ContentChildren,
  Directive,
  DoCheck,
  QueryList,
  inject,
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { Subject, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { SharedUiFormMessageErrorDirective } from '../shared-ui-form-message/shared-ui-form-message-error.directive';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[dvSharedUiFormField]',
  standalone: true,
})
export class SharedUiFormFieldDirective implements DoCheck, AfterViewInit {
  @ContentChildren(SharedUiFormMessageErrorDirective, { descendants: true })
  errorMessages!: QueryList<SharedUiFormMessageErrorDirective>;
  touchedStateDuringCheck$ = new Subject<boolean | null>();

  // Can be used on a MatFormField or FormControlName component/directive, useful for radio-groups for example
  matFormField = inject(MatFormField, { optional: true });
  selfControl = inject(FormControlName, { optional: true });

  private get nullableControl() {
    return this.matFormField?._control?.ngControl ?? this.selfControl;
  }
  private get control() {
    if (!this.nullableControl) {
      throw new Error(
        'No ngControl was found, please make sure that there is a MatFormFieldControl'
      );
    }
    return this.nullableControl;
  }

  ngDoCheck(): void {
    if (!this.nullableControl) {
      return;
    }

    this.touchedStateDuringCheck$.next(this.control.touched);
  }

  ngAfterViewInit() {
    const touched$ = this.touchedStateDuringCheck$.pipe(
      startWith(false),
      distinctUntilChanged()
    );
    const errorMessages$ = this.errorMessages.changes.pipe(
      startWith({}),
      map(() => this.errorMessages?.toArray() ?? [])
    );
    const validityHasChanged$ =
      this.control.statusChanges?.pipe(
        startWith(null),
        map(() => this.control.status)
      ) ?? of(null);
    combineLatest([validityHasChanged$, errorMessages$, touched$])
      .pipe(map((values) => [...values, this.control.touched] as const))
      .subscribe(([, errorMesages, touched]) => {
        if (!touched) {
          errorMesages?.forEach((m) => m.hide());
        } else {
          errorMesages?.forEach((m) => {
            if (m.errorKey && this.control.errors?.[m.errorKey]) {
              m.show();
            } else {
              m.hide();
            }
          });
        }
      });
  }
}
