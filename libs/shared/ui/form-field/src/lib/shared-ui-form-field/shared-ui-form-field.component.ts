import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  Input,
  QueryList,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import { SharedUiFormLabelComponent } from '../shared-ui-form-label/shared-ui-form-label.component';
import { SharedUiFormMessageInfoDirective } from '../shared-ui-form-message/shared-ui-form-message-info.directive';
import { SharedUiFormMessageErrorDirective } from '../shared-ui-form-message/shared-ui-form-message-error.directive';

let nextUniqueId = 0;

@Component({
  selector: 'dv-shared-ui-form-field',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, NgTemplateOutlet, TranslateModule],
  templateUrl: './shared-ui-form-field.component.html',
  styleUrls: ['./shared-ui-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiFormFieldComponent implements DoCheck, AfterContentInit {
  @Input() isCheckbox = false;

  @ContentChild(SharedUiFormLabelComponent, { read: ElementRef })
  formLabel: ElementRef | undefined;

  @ContentChild(NgControl) formFieldControl: NgControl | undefined;

  @ContentChildren(SharedUiFormMessageInfoDirective) infoMessages:
    | QueryList<SharedUiFormMessageInfoDirective>
    | undefined;
  @ContentChildren(SharedUiFormMessageErrorDirective) errorMessages:
    | QueryList<SharedUiFormMessageErrorDirective>
    | undefined;

  controlId = `dv-form-field-${nextUniqueId++}`;
  showInfoMessages = false;

  touched$: Observable<boolean> | undefined;
  touchedStateDuringCheck$ = new Subject<boolean>();
  showInfoIcon$: Observable<boolean> | undefined;
  errorMessages$: Observable<SharedUiFormMessageErrorDirective[]> | undefined;

  ngDoCheck(): void {
    if (!this.formFieldControl) {
      return;
    }

    if (this.formFieldControl?.untouched) {
      this.touchedStateDuringCheck$.next(false);
    }

    if (this.formFieldControl?.touched) {
      this.touchedStateDuringCheck$.next(true);
    }
  }

  ngAfterContentInit(): void {
    this.showInfoIcon$ = this.infoMessages?.changes.pipe(
      startWith(this.infoMessages),
      map((messages) => messages.length > 0)
    );

    this.touched$ = this.touchedStateDuringCheck$
      .asObservable()
      .pipe(startWith(false), distinctUntilChanged());

    this.errorMessages$ = this.touched$.pipe(
      switchMap((touched) => {
        if (touched) {
          return this.formFieldControl!.statusChanges!.pipe(
            startWith(this.formFieldControl!.status),
            map((status) =>
              status === 'VALID' ? [] : this.getAccurateErrors()
            )
          );
        } else {
          return of([]);
        }
      })
    );
  }

  toggleInfoMessages() {
    this.showInfoMessages = !this.showInfoMessages;
  }

  trackByIndex(index: number) {
    return index;
  }

  private getAccurateErrors(): SharedUiFormMessageErrorDirective[] {
    if (!this.formFieldControl?.errors) {
      return [];
    }
    const errorKeys = Object.keys(this.formFieldControl.errors);
    return this.errorMessages!.reduce(
      (
        acc: SharedUiFormMessageErrorDirective[],
        current: SharedUiFormMessageErrorDirective
      ) => {
        if (errorKeys.includes(current.errorKey!) || !current.errorKey) {
          acc.push(current);
        }
        return acc;
      },
      []
    );
  }
}
