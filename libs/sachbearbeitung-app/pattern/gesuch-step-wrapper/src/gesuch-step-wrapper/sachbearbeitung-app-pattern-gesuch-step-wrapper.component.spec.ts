import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { KeycloakAngularModule } from 'keycloak-angular';

import { SachbearbeitungAppPatternGesuchStepWrapperComponent } from './sachbearbeitung-app-pattern-gesuch-step-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SachbearbeitungAppPatternGesuchStepWrapperComponent', () => {
  let component: SachbearbeitungAppPatternGesuchStepWrapperComponent;
  let fixture: ComponentFixture<SachbearbeitungAppPatternGesuchStepWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [
        SachbearbeitungAppPatternGesuchStepWrapperComponent,
        KeycloakAngularModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SachbearbeitungAppPatternGesuchStepWrapperComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
