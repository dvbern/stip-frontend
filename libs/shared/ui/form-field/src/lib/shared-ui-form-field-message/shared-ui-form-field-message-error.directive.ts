import { Directive, inject, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dvSharedUiFormFieldMessageError]',
  standalone: true,
})
export class SharedUiFormFieldMessageErrorDirective {
  public templateRef = inject(TemplateRef<any>);
  @Input('dvSharedUiFormFieldMessageError') errorKey: string | undefined | null;
}
