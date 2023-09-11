import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';

import { GesuchAppPatternMainLayoutComponent } from './gesuch-app-pattern-main-layout.component';
import { KeycloakAngularModule } from 'keycloak-angular';

describe('MainLayoutComponent', () => {
  let component: GesuchAppPatternMainLayoutComponent;
  let fixture: ComponentFixture<GesuchAppPatternMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [
        GesuchAppPatternMainLayoutComponent,
        TranslateModule.forRoot(),
        KeycloakAngularModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppPatternMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
