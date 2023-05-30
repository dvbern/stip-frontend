import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { GesuchAppFeatureCockpitComponent } from './gesuch-app-feature-cockpit.component';

describe('GesuchAppFeatureCockpitComponent', () => {
  let component: GesuchAppFeatureCockpitComponent;
  let fixture: ComponentFixture<GesuchAppFeatureCockpitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GesuchAppFeatureCockpitComponent,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(GesuchAppFeatureCockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
