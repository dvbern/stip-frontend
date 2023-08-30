import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiWohnsitzSplitterComponent } from './shared-ui-wohnsitz-splitter.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SharedUiWohnsitzSplitterComponent', () => {
  let component: SharedUiWohnsitzSplitterComponent;
  let fixture: ComponentFixture<SharedUiWohnsitzSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        SharedUiWohnsitzSplitterComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiWohnsitzSplitterComponent);
    component = fixture.componentInstance;
    component.controls = {
      wohnsitzAnteilMutter: new FormControl(<string | undefined>undefined, {
        nonNullable: true,
      }),
      wohnsitzAnteilVater: new FormControl(<string | undefined>undefined, {
        nonNullable: true,
      }),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
