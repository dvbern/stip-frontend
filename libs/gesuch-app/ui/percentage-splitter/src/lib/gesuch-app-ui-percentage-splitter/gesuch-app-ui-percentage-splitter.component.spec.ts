import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GesuchAppUiPercentageSplitterComponent } from './gesuch-app-ui-percentage-splitter.component';

describe('GesuchAppUiPercentageSplitterComponent', () => {
  let component: GesuchAppUiPercentageSplitterComponent;
  let fixture: ComponentFixture<GesuchAppUiPercentageSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesuchAppUiPercentageSplitterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppUiPercentageSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
