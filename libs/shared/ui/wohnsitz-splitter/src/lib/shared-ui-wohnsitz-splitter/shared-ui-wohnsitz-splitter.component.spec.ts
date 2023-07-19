import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiWohnsitzSplitterComponent } from './shared-ui-wohnsitz-splitter.component';

describe('SharedUiWohnsitzSplitterComponent', () => {
  let component: SharedUiWohnsitzSplitterComponent;
  let fixture: ComponentFixture<SharedUiWohnsitzSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiWohnsitzSplitterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiWohnsitzSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
