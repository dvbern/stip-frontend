import { Directive, ElementRef, inject, OnInit } from '@angular/core';

import { SharedUiFormComponent } from '../shared-ui-form-field/shared-ui-form-field.component';

@Directive({
  standalone: true,
  selector: '[dvSharedUiFormLabelTarget]',
})
export class SharedUiFormLabelTargetDirective implements OnInit {
  private parentFormField = inject(SharedUiFormComponent);

  private host = inject(ElementRef);

  ngOnInit(): void {
    if (this.parentFormField) {
      this.host.nativeElement.id = this.parentFormField.controlId;
    }
  }
}
