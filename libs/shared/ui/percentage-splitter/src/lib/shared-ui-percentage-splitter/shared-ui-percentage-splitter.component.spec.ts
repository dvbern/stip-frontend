import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiPercentageSplitterComponent } from './shared-ui-percentage-splitter.component';

describe('SharedUiPercentageSplitterComponent', () => {
  let component: SharedUiPercentageSplitterComponent;
  let fixture: ComponentFixture<SharedUiPercentageSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiPercentageSplitterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiPercentageSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
