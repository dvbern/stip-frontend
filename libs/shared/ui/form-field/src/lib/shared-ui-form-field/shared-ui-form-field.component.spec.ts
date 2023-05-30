import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormFieldComponent } from './shared-ui-form-field.component';

describe('SharedUiFormFieldComponent', () => {
  let component: SharedUiFormFieldComponent;
  let fixture: ComponentFixture<SharedUiFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
