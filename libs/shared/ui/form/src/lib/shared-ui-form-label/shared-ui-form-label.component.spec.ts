import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormLabelComponent } from './shared-ui-form-label.component';

describe('SharedUiFormLabelComponent', () => {
  let component: SharedUiFormLabelComponent;
  let fixture: ComponentFixture<SharedUiFormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
