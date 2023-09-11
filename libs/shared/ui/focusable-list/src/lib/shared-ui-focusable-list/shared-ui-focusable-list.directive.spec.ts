import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SharedUiFocusableListDirective } from './shared-ui-focusable-list.directive';

@Component({
  selector: 'dv-test-item-component',
  standalone: true,
  imports: [SharedUiFocusableListDirective],
  providers: [
    {
      provide: RouterLink,
      useValue: null as any,
    },
  ],
  template: `<a dvSharedUiFocusableList></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestListComponent {}

describe('SharedUiFocusableListComponent', () => {
  let component: TestListComponent;
  let fixture: ComponentFixture<TestListComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
