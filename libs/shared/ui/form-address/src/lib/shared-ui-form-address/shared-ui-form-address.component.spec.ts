import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedUiFormAddressComponent } from './shared-ui-form-address.component';

describe('SharedUiFormAddressComponent', () => {
  let component: SharedUiFormAddressComponent;
  let fixture: ComponentFixture<SharedUiFormAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormAddressComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormAddressComponent);
    component = fixture.componentInstance;
    component.group = SharedUiFormAddressComponent.buildAddressFormGroup(
      TestBed.inject(FormBuilder)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
