import {
  Directive,
  HostListener,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

import { SharedUiFocusableListItemDirective } from '../shared-ui-focusable-list-item/shared-ui-focusable-list-item.directive';

@Directive({
  selector: '[dvSharedUiFocusableList]',
  standalone: true,
})
export class SharedUiFocusableListDirective implements OnChanges {
  @Input({ required: true })
  public dvSharedUiFocusableList?: QueryList<SharedUiFocusableListItemDirective>;
  private keyManager?: ActiveDescendantKeyManager<SharedUiFocusableListItemDirective>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dvSharedUiFocusableList'].currentValue) {
      const items = this.dvSharedUiFocusableList;
      if (items) {
        if (this.keyManager) {
          this.keyManager.destroy();
        }
        this.keyManager = new ActiveDescendantKeyManager(items).withWrap();
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.keyManager?.activeItem?.interact();
    } else {
      this.keyManager?.onKeydown(event);
    }
  }
}
