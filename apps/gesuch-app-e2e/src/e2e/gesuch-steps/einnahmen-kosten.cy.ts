import {
  getStepEinnahmenKostenAusbildung,
  getStepTitle,
  SharedEinnahmenKostenInAusbildungPO,
} from '@dv/shared/util-fn/e2e-helpers';

import { CockpitPO } from '../../support/po/cockpit.po';

describe('gesuch-app einnahmen & kosten form', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should edit einnahmen und kosten with correct number formatting', () => {
    CockpitPO.openGesuch();
    getStepEinnahmenKostenAusbildung().click();
    getStepTitle().should('contain.text', 'Einnahmen & Kosten');
    SharedEinnahmenKostenInAusbildungPO.getFormLoading().should('exist');
    SharedEinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().should(
      'exist'
    );
    SharedEinnahmenKostenInAusbildungPO.getFormLoading().should('not.exist');

    // Name auslesen
    SharedEinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen()
      .invoke('val')
      .then(() => {
        // Name updaten
        SharedEinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().focus();
        SharedEinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().clear();
        SharedEinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().type(
          '10000'
        );
        SharedEinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().should(
          'have.value',
          "10'000"
        );
      });
  });
});
