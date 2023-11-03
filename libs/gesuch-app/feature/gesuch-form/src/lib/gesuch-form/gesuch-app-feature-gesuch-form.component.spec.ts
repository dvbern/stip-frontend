import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { provideSharedPatternJestTestSetup } from '@dv/shared/pattern/jest-test-setup';

import { GesuchAppFeatureGesuchFormComponent } from './gesuch-app-feature-gesuch-form.component';

describe('GesuchAppFeatureGesuchFormComponent', () => {
  let component: GesuchAppFeatureGesuchFormComponent;
  let fixture: ComponentFixture<GesuchAppFeatureGesuchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { gesuchs: { gesuchFormular: {} } },
        }),
        provideSharedPatternJestTestSetup(),
      ],
      imports: [GesuchAppFeatureGesuchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppFeatureGesuchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
