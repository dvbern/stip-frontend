import { Directive, ElementRef, inject, OnInit } from '@angular/core';

import { SharedUiFormFieldComponent } from '../shared-ui-form-field/shared-ui-form-field.component';

@Directive({
  standalone: true,
  selector: '[dvSharedUiFormFieldLabelTarget]',
})
export class SharedUiFormFieldLabelTargetDirective implements OnInit {
  private parentFormField = inject(SharedUiFormFieldComponent);

  private host = inject(ElementRef);

  ngOnInit(): void {
    if (this.parentFormField) {
      this.host.nativeElement.id = this.parentFormField.controlId;
    }
  }
}
