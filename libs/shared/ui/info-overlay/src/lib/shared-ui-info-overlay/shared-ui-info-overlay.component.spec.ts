import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiInfoOverlayComponent } from './shared-ui-info-overlay.component';

describe('SharedUiInfoOverlayComponent', () => {
  let component: SharedUiInfoOverlayComponent;
  let fixture: ComponentFixture<SharedUiInfoOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiInfoOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiInfoOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
