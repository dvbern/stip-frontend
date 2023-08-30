import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SharedUiFormControlProxyDirective,
  injectTargetControl,
} from './shared-ui-form-control-proxy.directive';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'dv-test-component',
  hostDirectives: [SharedUiFormControlProxyDirective],
  template: `<input [formControl]="ngControl.control" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  ngControl = injectTargetControl();
}
@Component({
  hostDirectives: [SharedUiFormControlProxyDirective],
  template: `<dv-test-component [formControl]="control" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestWrapperComponent {
  control = new FormControl('');
}

describe('SharedUiFormControlProxyDirective', () => {
  let directive: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormControlProxyDirective, ReactiveFormsModule],
      declarations: [TestComponent, TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
