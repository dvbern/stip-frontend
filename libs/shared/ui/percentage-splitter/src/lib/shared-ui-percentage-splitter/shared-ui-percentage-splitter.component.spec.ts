import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiPercentageSplitterComponent } from './shared-ui-percentage-splitter.component';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SharedUiPercentageSplitterComponent', () => {
  let component: SharedUiPercentageSplitterComponent;
  let fixture: ComponentFixture<SharedUiPercentageSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedUiPercentageSplitterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiPercentageSplitterComponent);
    component = fixture.componentInstance;
    component.controlA = new FormControl();
    component.controlB = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
