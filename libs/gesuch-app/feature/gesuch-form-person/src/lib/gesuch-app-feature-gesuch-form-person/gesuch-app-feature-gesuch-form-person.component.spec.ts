import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { GesuchAppFeatureGesuchFormPersonComponent } from './gesuch-app-feature-gesuch-form-person.component';

describe('GesuchAppFeatureGesuchFormPersonComponent', () => {
  let component: GesuchAppFeatureGesuchFormPersonComponent;
  let fixture: ComponentFixture<GesuchAppFeatureGesuchFormPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GesuchAppFeatureGesuchFormPersonComponent,
        TranslateModule.forRoot(),
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(
      GesuchAppFeatureGesuchFormPersonComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
