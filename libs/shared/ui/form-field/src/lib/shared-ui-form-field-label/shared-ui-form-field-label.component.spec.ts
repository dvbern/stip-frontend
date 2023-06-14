import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormFieldLabelComponent } from './shared-ui-form-field-label.component';

describe('SharedUiFormLabelComponent', () => {
  let component: SharedUiFormFieldLabelComponent;
  let fixture: ComponentFixture<SharedUiFormFieldLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormFieldLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormFieldLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
