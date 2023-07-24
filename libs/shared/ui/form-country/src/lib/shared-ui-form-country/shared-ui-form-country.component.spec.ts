import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormCountryComponent } from './shared-ui-form-country.component';

describe('SharedUiFormCountryComponent', () => {
  let component: SharedUiFormCountryComponent;
  let fixture: ComponentFixture<SharedUiFormCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormCountryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
