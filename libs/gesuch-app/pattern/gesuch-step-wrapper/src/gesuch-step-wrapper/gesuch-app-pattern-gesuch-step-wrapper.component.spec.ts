import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakAngularModule } from 'keycloak-angular';

import { GesuchAppPatternGesuchStepWrapperComponent } from './gesuch-app-pattern-gesuch-step-wrapper.component';

describe('GesuchAppPatternGesuchStepWrapperComponent', () => {
  let component: GesuchAppPatternGesuchStepWrapperComponent;
  let fixture: ComponentFixture<GesuchAppPatternGesuchStepWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        KeycloakAngularModule,
        GesuchAppPatternGesuchStepWrapperComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      GesuchAppPatternGesuchStepWrapperComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
