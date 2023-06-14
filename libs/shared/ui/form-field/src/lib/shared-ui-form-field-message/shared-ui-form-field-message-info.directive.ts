import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dvSharedUiFormFieldMessageInfo]',
  standalone: true,
})
export class SharedUiFormFieldMessageInfoDirective {
  public templateRef = inject(TemplateRef<any>);
}
