import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { provideMaterialDefaultOptions } from '@dv/shared/pattern/angular-material-config';
import { SharedEducationPO } from '@dv/shared/util-fn/e2e-helpers';
import { SharedFeatureGesuchFormEducationComponent } from './shared-feature-gesuch-form-education.component';

describe(SharedFeatureGesuchFormEducationComponent.name, () => {
  describe('form validity', () => {
    it('should be invalid if begin is not a date', () => {
      mountWithGesuch();
      SharedEducationPO.getFormBeginnDerAusbildung().type('gugus').blur();
      SharedEducationPO.getFormBeginnDerAusbildung().should(
        'have.class',
        'ng-invalid'
      );
    });
    it('should be invalid if end is not a date', () => {
      mountWithGesuch();
      SharedEducationPO.getFormEndeDerAusbildung().type('gugus').blur();
      SharedEducationPO.getFormEndeDerAusbildung().should(
        'have.class',
        'ng-invalid'
      );
    });
    it('should be valid if a past date is provided for begin', () => {
      mountWithGesuch();
      SharedEducationPO.getFormBeginnDerAusbildung().type('01.2020').blur();
      SharedEducationPO.getFormBeginnDerAusbildung().should(
        'not.have.class',
        'ng-invalid'
      );
    });
    it('should be valid if the begin date is before the end date', () => {
      mountWithGesuch();
      SharedEducationPO.getFormBeginnDerAusbildung().type('01.2019').blur();
      SharedEducationPO.getFormEndeDerAusbildung().type('01.2020').blur();
      SharedEducationPO.getFormBeginnDerAusbildung().should(
        'not.have.class',
        'ng-invalid'
      );
      SharedEducationPO.getFormEndeDerAusbildung().should(
        'not.have.class',
        'ng-invalid'
      );
    });
    it('should be invalid if the begin date is after the end date', () => {
      mountWithGesuch();
      SharedEducationPO.getFormBeginnDerAusbildung().type('01.2020').blur();
      SharedEducationPO.getFormEndeDerAusbildung().type('01.2019').blur();
      SharedEducationPO.getFormBeginnDerAusbildung().should(
        'not.have.class',
        'ng-invalid'
      );
      SharedEducationPO.getFormEndeDerAusbildung().should(
        'have.class',
        'ng-invalid'
      );
      SharedEducationPO.getForm().should('have.class', 'ng-invalid');
      SharedEducationPO.getForm()
        .find('mat-error')
        .should('include.text', 'YearAfterStart');
    });
  });
});

function mountWithGesuch(): void {
  cy.mount(SharedFeatureGesuchFormEducationComponent, {
    imports: [
      TranslateTestingModule.withTranslations({}),
      NoopAnimationsModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          ausbildungsstaettes: { ausbildungsstaettes: [] },
          gesuchs: {
            gesuchFormular: {},
          },
          language: { language: 'de' },
        },
      }),
      provideMaterialDefaultOptions(),
    ],
  });
}
