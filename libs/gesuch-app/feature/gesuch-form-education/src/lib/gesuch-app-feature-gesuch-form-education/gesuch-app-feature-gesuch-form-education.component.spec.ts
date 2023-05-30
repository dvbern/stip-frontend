import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { GesuchAppFeatureGesuchFormEducationComponent } from './gesuch-app-feature-gesuch-form-education.component';

describe('GesuchAppFeatureGesuchFormEducationComponent', () => {
  let component: GesuchAppFeatureGesuchFormEducationComponent;
  let fixture: ComponentFixture<GesuchAppFeatureGesuchFormEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GesuchAppFeatureGesuchFormEducationComponent,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      GesuchAppFeatureGesuchFormEducationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
