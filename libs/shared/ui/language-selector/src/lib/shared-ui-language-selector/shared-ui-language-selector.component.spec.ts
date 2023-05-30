import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedUiLanguageSelectorComponent } from './shared-ui-language-selector.component';

describe('SharedUiLanguageSelectorComponent', () => {
  let component: SharedUiLanguageSelectorComponent;
  let fixture: ComponentFixture<SharedUiLanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiLanguageSelectorComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiLanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
