import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormControlProxyDirective } from './shared-ui-form-control-proxy.directive';

describe('SharedUiFormControlProxyDirective', () => {
  let directive: SharedUiFormControlProxyDirective;
  let fixture: ComponentFixture<SharedUiFormControlProxyDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormControlProxyDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormControlProxyDirective);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
