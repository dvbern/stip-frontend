import { CockpitPO } from '../../support/po/cockpit.po';
import { EinnahmenKostenInAusbildungPO } from '../../support/po/gesuch-steps/einnahmen-kosten.po';
import {
  getStepEinnahmenKostenAusbildung,
  getStepTitle,
} from '../../support/shared/gesuch-steps.nav.po';

describe('gesuch-app einnahmen & kosten form', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should edit and revert person form', () => {
    CockpitPO.openGesuch();
    getStepEinnahmenKostenAusbildung().click();
    getStepTitle().should('contain.text', 'Einnahmen & Kosten');
    EinnahmenKostenInAusbildungPO.getFormLoading().should('exist');
    EinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().should(
      'exist'
    );
    EinnahmenKostenInAusbildungPO.getFormLoading().should('not.exist');

    // Name auslesen
    EinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen()
      .invoke('val')
      .then(() => {
        // Name updaten
        EinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().focus();
        EinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().clear();
        EinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().type(
          '10000'
        );
        EinnahmenKostenInAusbildungPO.getFormNettoerwerbseinkommen().should(
          'have.value',
          "10'000"
        );
      });
  });
});
