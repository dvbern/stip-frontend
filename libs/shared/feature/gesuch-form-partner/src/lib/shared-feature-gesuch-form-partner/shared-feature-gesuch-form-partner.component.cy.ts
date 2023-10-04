import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { GesuchFormular, PartnerUpdate } from '@dv/shared/model/gesuch';
import { provideMaterialDefaultOptions } from '@dv/shared/pattern/angular-material-config';

import { SharedFeatureGesuchFormPartnerComponent } from './shared-feature-gesuch-form-partner.component';
import { getSubmitButton } from '@dv/shared/util-fn/e2e-helpers';

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
              language: {
                language: 'de',
              },
              gesuch: null,
              gesuchFormulasr: {
                partner: {} as PartnerUpdate,
              } as GesuchFormular,
              gesuchs: [],
              loading: false,
              error: undefined,
              stammdatens: {
                laender: [],
              },
            },
          }),
          provideMaterialDefaultOptions(),
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

  it('should allow to save the form when all required fields are filled in if "ausbildungMitEinkommenOderErwerbstaetig" is not selected', () => {
    fillBasicForm();
    getSubmitButton().click();
    cy.get('mat-error', { timeout: 0 }).should('not.exist');
    cy.getByTestId('form')
      .first({ timeout: 0 })
      .should('not.have.class', 'ng-invalid');
  });

  it('should allow to save the form when all required fields are filled in if "ausbildungMitEinkommenOderErwerbstaetig" is selected', () => {
    fillBasicForm();
    clickAusbildungMitEinkommenOderErwerbstaetigCheckbox();
    cy.getByTestId('fahrkosten').should('exist');
    cy.getByTestId('fahrkosten').type('3000');
    cy.getByTestId('jahreseinkommen').should('exist');
    cy.getByTestId('jahreseinkommen').type('4000');
    cy.getByTestId('verpflegungskosten').should('exist');
    cy.getByTestId('verpflegungskosten').type('5000');
    getSubmitButton().click();
    cy.get('mat-error', { timeout: 0 }).should('not.exist');
    cy.getByTestId('form')
      .first({ timeout: 0 })
      .should('not.have.class', 'ng-invalid');
  });

  it('should reset jahreseinkommen, verpflegunskosten and fahrkosten if "ausbildungMitEinkommenOderErwerbstaetig" is selected, unselected, and selected again', () => {
    clickAusbildungMitEinkommenOderErwerbstaetigCheckbox();
    cy.getByTestId('fahrkosten').should('exist');
    cy.getByTestId('fahrkosten').type('3000');
    cy.getByTestId('jahreseinkommen').should('exist');
    cy.getByTestId('jahreseinkommen').type('4000');
    cy.getByTestId('verpflegungskosten').should('exist');
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

const fillBasicForm = () => {
  cy.getByTestId('sozialversicherungsnummer').should('exist');
  cy.getByTestId('sozialversicherungsnummer').type('756.9217.0769.85');
  cy.getByTestId('nachname').should('exist');
  cy.getByTestId('nachname').type('Test N');
  cy.getByTestId('vorname').should('exist');
  cy.getByTestId('vorname').type('Test V');

  cy.getByTestId('strasse').should('exist');
  cy.getByTestId('strasse').type('Test street');
  cy.getByTestId('plz').should('exist');
  cy.getByTestId('plz').type('3000');
  cy.getByTestId('ort').should('exist');
  cy.getByTestId('ort').type('Bern');
  cy.getByTestId('land').should('exist');
  cy.getByTestId('land').click();
  cy.getByTestId('land').get('mat-option').eq(1).click();

  cy.getByTestId('geburtsdatum').should('exist');
  cy.getByTestId('geburtsdatum').click();
  cy.getByTestId('geburtsdatum').type('01.01.1990');
};
