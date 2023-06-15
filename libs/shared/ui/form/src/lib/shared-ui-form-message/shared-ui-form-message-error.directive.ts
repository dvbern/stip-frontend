import { Directive, inject, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dvSharedUiFormMessageError]',
  standalone: true,
})
export class SharedUiFormMessageErrorDirective {
  public templateRef = inject(TemplateRef<any>);
  @Input('dvSharedUiFormMessageError') errorKey: string | undefined | null;
}
