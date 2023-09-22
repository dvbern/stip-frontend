import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { GesuchFormular, PartnerUpdate } from '@dv/shared/model/gesuch';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SharedFeatureGesuchFormPartnerComponent } from './shared-feature-gesuch-form-partner.component';

function clickAusbildungMitEinkommenOderErwerbstaetigCheckbox(): void {
  cy.getByTestId('ausbildungMitEinkommenOderErwerbstaetig')
    .find('input')
    .click();
}

describe(SharedFeatureGesuchFormPartnerComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(SharedFeatureGesuchFormPartnerComponent, {
      add: {
        imports: [],
        providers: [
          provideMockStore({
            initialState: {
              gesuch: null,
              gesuchFormulasr: {
                partner: {} as PartnerUpdate,
              } as GesuchFormular,
              gesuchs: [],
              loading: false,
              error: undefined,
            },
          }),
        ],
      },
    });
    cy.mount(SharedFeatureGesuchFormPartnerComponent, {
      imports: [
        TranslateTestingModule.withTranslations({ de: {} }),
        BrowserAnimationsModule,
      ],
    });
  });

  it('should display jahreseinkommen, verpflegunskosten and fahrkosten if "ausbildungMitEinkommenOderErwerbstaetig" is not selected', () => {
    cy.getByTestId('fahrkosten').should('not.exist');
    cy.getByTestId('jahreseinkommen').should('not.exist');
    cy.getByTestId('verpflegungskosten').should('not.exist');
  });

  it('should display jahreseinkommen, verpflegunskosten and fahrkosten if "ausbildungMitEinkommenOderErwerbstaetig" is selected', () => {
    clickAusbildungMitEinkommenOderErwerbstaetigCheckbox();
    cy.getByTestId('fahrkosten').should('exist');
    cy.getByTestId('jahreseinkommen').should('exist');
    cy.getByTestId('verpflegungskosten').should('exist');
  });
  it('should reset jahreseinkommen, verpflegunskosten and fahrkosten if "ausbildungMitEinkommenOderErwerbstaetig" is selected, unselected, and selected again', () => {
    clickAusbildungMitEinkommenOderErwerbstaetigCheckbox();
    cy.getByTestId('fahrkosten').should('exist');
    cy.getByTestId('fahrkosten-label').click();
    cy.getByTestId('fahrkosten').type('3000');
    cy.getByTestId('jahreseinkommen').should('exist');
    cy.getByTestId('jahreseinkommen-label').click();
    cy.getByTestId('jahreseinkommen').type('4000');
    cy.getByTestId('verpflegungskosten').should('exist');
    cy.getByTestId('verpflegungskosten-label').click();
    cy.getByTestId('verpflegungskosten').type('5000');
    clickAusbildungMitEinkommenOderErwerbstaetigCheckbox();
    cy.getByTestId('fahrkosten').should('not.exist');
    cy.getByTestId('jahreseinkommen').should('not.exist');
    cy.getByTestId('verpflegungskosten').should('not.exist');
    clickAusbildungMitEinkommenOderErwerbstaetigCheckbox();
    cy.getByTestId('fahrkosten').should('not.have.value');
    cy.getByTestId('jahreseinkommen').should('not.have.value');
    cy.getByTestId('verpflegungskosten').should('not.have.value');
  });
});
