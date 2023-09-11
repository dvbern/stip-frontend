import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SharedUiFocusableListItemDirective } from './shared-ui-focusable-list-item.directive';

@Component({
  selector: 'dv-test-item-component',
  standalone: true,
  imports: [SharedUiFocusableListItemDirective],
  providers: [
    {
      provide: RouterLink,
      useValue: null as any,
    },
  ],
  template: `<a dvSharedUiFocusableListItem></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestItemComponent {}

describe('SharedUiFocusableListComponent', () => {
  let component: TestItemComponent;
  let fixture: ComponentFixture<TestItemComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
