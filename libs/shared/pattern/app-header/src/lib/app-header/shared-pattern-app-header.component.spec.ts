import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedPatternAppHeaderComponent } from './shared-pattern-app-header.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SharedPatternAppHeaderComponent', () => {
  let component: SharedPatternAppHeaderComponent;
  let fixture: ComponentFixture<SharedPatternAppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedPatternAppHeaderComponent,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedPatternAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
