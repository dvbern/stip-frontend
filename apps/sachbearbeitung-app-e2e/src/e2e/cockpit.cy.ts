import { CockpitPO } from '../support/po/cockpit.po';

describe('sachbearbeitung-app cockpit', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should redirect to cockpit on startup', () => {
    cy.url().should('include', 'sachbearbeitung-app-feature-cockpit');
  });

  it('should render gesuch table', () => {
    CockpitPO.getList().should('exist');
    CockpitPO.getRows().should('have.length.above', 0);
  });
});
