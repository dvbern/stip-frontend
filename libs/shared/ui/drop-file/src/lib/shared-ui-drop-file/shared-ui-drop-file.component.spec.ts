import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiDropFileComponent } from './shared-ui-drop-file.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SharedUiDropFileComponent', () => {
  let component: SharedUiDropFileComponent;
  let fixture: ComponentFixture<SharedUiDropFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiDropFileComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiDropFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
