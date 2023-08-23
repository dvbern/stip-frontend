import {
  Directive,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[dvSharedUiFormMessageError]',
  standalone: true,
})
export class SharedUiFormMessageErrorDirective {
  @Input('dvSharedUiFormMessageError') errorKey: string | undefined | null;
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private created = false;

  public show() {
    if (!this.created) {
      this.created = true;
      const ref = this.viewContainerRef.createEmbeddedView(this.templateRef);
      const element = ref.rootNodes[0];
      if (element) {
        this.renderer.addClass(element, 'invalid-feedback');
      }
    }
  }
  public hide() {
    this.created = false;
    this.viewContainerRef.clear();
  }
}
