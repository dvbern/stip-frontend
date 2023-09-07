import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiGesuchStepWrapperComponent } from './shared-ui-gesuch-step-wrapper.component';
describe('SharedUiGesuchStepWrapperComponent', () => {
  let component: SharedUiGesuchStepWrapperComponent;
  let fixture: ComponentFixture<SharedUiGesuchStepWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiGesuchStepWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiGesuchStepWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
