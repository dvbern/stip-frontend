import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiDvFormComponentComponent } from './shared-ui-dv-form-component.component';

describe('SharedUiDvFormComponentComponent', () => {
  let component: SharedUiDvFormComponentComponent;
  let fixture: ComponentFixture<SharedUiDvFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiDvFormComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiDvFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
