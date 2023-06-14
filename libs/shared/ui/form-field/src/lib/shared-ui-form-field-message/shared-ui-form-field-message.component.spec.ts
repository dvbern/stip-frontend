import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormFieldMessageComponent } from './shared-ui-form-field-message.component';

describe('SharedUiFormMessageComponent', () => {
  let component: SharedUiFormFieldMessageComponent;
  let fixture: ComponentFixture<SharedUiFormFieldMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormFieldMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormFieldMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
