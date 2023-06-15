import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormComponent } from './shared-ui-form-field.component';

describe('SharedUiFormComponent', () => {
  let component: SharedUiFormComponent;
  let fixture: ComponentFixture<SharedUiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
