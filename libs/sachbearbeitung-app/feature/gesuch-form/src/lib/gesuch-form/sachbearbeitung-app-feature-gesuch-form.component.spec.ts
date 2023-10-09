import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { provideSharedPatternJestTestSetup } from '@dv/shared/pattern/jest-test-setup';

import { SachbearbeitungAppFeatureGesuchFormComponent } from './sachbearbeitung-app-feature-gesuch-form.component';

describe('SachbearbeitungAppFeatureGesuchFormComponent', () => {
  let component: SachbearbeitungAppFeatureGesuchFormComponent;
  let fixture: ComponentFixture<SachbearbeitungAppFeatureGesuchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { gesuchs: { gesuchFormular: {} } },
        }),
        provideSharedPatternJestTestSetup(),
      ],
      imports: [SachbearbeitungAppFeatureGesuchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SachbearbeitungAppFeatureGesuchFormComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
