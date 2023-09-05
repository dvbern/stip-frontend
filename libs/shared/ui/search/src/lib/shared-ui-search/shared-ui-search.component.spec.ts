import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiSearchComponent } from './shared-ui-search.component';

describe('SharedUiSearchComponent', () => {
  let component: SharedUiSearchComponent;
  let fixture: ComponentFixture<SharedUiSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
