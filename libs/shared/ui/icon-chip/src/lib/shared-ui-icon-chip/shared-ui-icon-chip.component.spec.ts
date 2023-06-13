import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiIconChipComponent } from './shared-ui-icon-chip.component';

describe('SharedUiIconChipComponent', () => {
  let component: SharedUiIconChipComponent;
  let fixture: ComponentFixture<SharedUiIconChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiIconChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiIconChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
