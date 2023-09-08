import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GesuchAppUiStepFormButtonsComponent } from './shared-ui-step-form-buttons.component';

describe('GesuchAppUiStepFormButtonsComponent', () => {
  let component: GesuchAppUiStepFormButtonsComponent;
  let fixture: ComponentFixture<GesuchAppUiStepFormButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesuchAppUiStepFormButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppUiStepFormButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
