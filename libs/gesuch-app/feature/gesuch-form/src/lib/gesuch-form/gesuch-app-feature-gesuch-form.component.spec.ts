import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakAngularModule } from 'keycloak-angular';

import { GesuchAppFeatureGesuchFormComponent } from './gesuch-app-feature-gesuch-form.component';

describe('GesuchAppFeatureGesuchFormComponent', () => {
  let component: GesuchAppFeatureGesuchFormComponent;
  let fixture: ComponentFixture<GesuchAppFeatureGesuchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        KeycloakAngularModule,
        GesuchAppFeatureGesuchFormComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppFeatureGesuchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
