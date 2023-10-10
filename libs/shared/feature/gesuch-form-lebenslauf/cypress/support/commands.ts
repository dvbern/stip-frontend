/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    matSelect(matSelect: Chainable, value: string): Chainable;
  }
}

Cypress.Commands.add(
  'matSelect',
  (matSelect: Chainable, value: string): Chainable => {
    matSelect.click();
    return cy.get('mat-option').contains(value).click();
  }
);
