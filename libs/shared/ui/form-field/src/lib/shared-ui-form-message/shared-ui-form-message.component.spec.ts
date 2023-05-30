import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiFormMessageComponent } from './shared-ui-form-message.component';

describe('SharedUiFormMessageComponent', () => {
  let component: SharedUiFormMessageComponent;
  let fixture: ComponentFixture<SharedUiFormMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiFormMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiFormMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
