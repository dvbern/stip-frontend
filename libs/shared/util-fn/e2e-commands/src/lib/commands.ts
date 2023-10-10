/// <reference types="cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import Chainable = Cypress.Chainable;

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(credentials?: { email: string; password: string }): void;

    getBySel(selector: string): Chainable;
  }
}

Cypress.Commands.add('login', (credentials) => {
  const E2E_USERNAME = Cypress.env('E2E_USERNAME');
  const E2E_PASSWORD = Cypress.env('E2E_PASSWORD');
  if (!E2E_USERNAME || !E2E_PASSWORD) {
    throw new Error('Env E2E_USERNAME or E2E_PASSWORD not set');
  }
  const username = credentials?.email ?? E2E_USERNAME;
  const password = credentials?.password ?? E2E_PASSWORD;
  cy.session(
    [username, password],
    () => {
      cy.visit('/');
      cy.get('body').children('dv-root').should('not.exist');
      cy.get('input#username').type(username, { log: false });
      cy.get('input#password').type(password, { log: false });
      cy.get('input[type=submit]').click();
    },
    {
      validate() {
        cy.request('/api/v1/ausbildungsstaette')
          .its('status')
          .should('eq', 200);
      },
    }
  );
});

Cypress.Commands.add('getBySel', (selector, ...args): Chainable => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
