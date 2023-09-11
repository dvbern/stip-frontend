import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiStepperNavigationComponent } from './shared-ui-stepper-navigation.component';

describe('SharedUiStepperNavigationComponent', () => {
  let component: SharedUiStepperNavigationComponent;
  let fixture: ComponentFixture<SharedUiStepperNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiStepperNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiStepperNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
