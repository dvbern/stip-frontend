import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiProgressBarComponent } from './shared-ui-progress-bar.component';

describe('SharedUiProgressBarComponent', () => {
  let component: SharedUiProgressBarComponent;
  let fixture: ComponentFixture<SharedUiProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
