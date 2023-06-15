import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dvSharedUiFormMessageInfo]',
  standalone: true,
})
export class SharedUiFormMessageInfoDirective {
  public templateRef = inject(TemplateRef<any>);
}
