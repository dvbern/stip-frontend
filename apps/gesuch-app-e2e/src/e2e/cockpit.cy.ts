import { getGesuchDescription, getGesuchEdit } from '../support/cockpit.po';

describe('gesuch-app cockpit', () => {
  beforeEach(() => cy.visit('/'));

  it('should redirect to cockpit on startup', () => {
    cy.url().should('include', 'gesuch-app-feature-cockpit');
  });

  it('should render gesuch', () => {
    getGesuchDescription().should('exist');
    getGesuchDescription().first().should('contain.text', 'Tomas Trajan');
  });
});
