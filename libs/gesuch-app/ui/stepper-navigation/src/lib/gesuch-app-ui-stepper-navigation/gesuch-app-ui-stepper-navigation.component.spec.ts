import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GesuchAppUiStepperNavigationComponent } from './gesuch-app-ui-stepper-navigation.component';

describe('GesuchAppUiStepperNavigationComponent', () => {
  let component: GesuchAppUiStepperNavigationComponent;
  let fixture: ComponentFixture<GesuchAppUiStepperNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesuchAppUiStepperNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppUiStepperNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
