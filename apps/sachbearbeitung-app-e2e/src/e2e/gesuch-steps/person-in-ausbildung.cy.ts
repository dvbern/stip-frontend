import {
  getNavDashboard,
  getStepPersonInAusbildung,
  getStepTitle,
  SharedPersonInAusbildungPO,
} from '@dv/shared/util-fn/e2e-helpers';

import { CockpitPO } from '../../support/po/cockpit.po';

describe('sachbearbeitung-app gesuch form', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should edit and revert person form', () => {
    CockpitPO.openGesuch();
    getStepPersonInAusbildung().click();
    getStepTitle().should('contain.text', 'Person in Ausbildung');
    SharedPersonInAusbildungPO.getFormPersonLoading().should('not.exist');

    // Name auslesen
    SharedPersonInAusbildungPO.getFormPersonName()
      .invoke('val')
      .then((prevName) => {
        // Name updaten
        SharedPersonInAusbildungPO.getFormPersonName().focus();
        SharedPersonInAusbildungPO.getFormPersonName().clear();
        SharedPersonInAusbildungPO.getFormPersonName().type('Updated name');

        // speichern und weiter
        cy.get('form').submit();
        getStepTitle().should('contain.text', 'Ausbildung');

        // zurueck zu Person in Ausbildung
        getNavDashboard().last().click();
        CockpitPO.getTitle().should('exist');
        CockpitPO.openGesuch();
        getStepPersonInAusbildung().click();
        getStepTitle().should('contain.text', 'Person in Ausbildung');
        SharedPersonInAusbildungPO.getFormPersonName()
          .invoke('val')
          .then((updatedName) => {
            // CHECK: Name muss geaendert worden sein
            expect(updatedName === 'Updated name');

            // RESET: Name zuruecksetzen
            SharedPersonInAusbildungPO.getFormPersonName().focus();
            SharedPersonInAusbildungPO.getFormPersonName().clear();
            SharedPersonInAusbildungPO.getFormPersonName().type(prevName);
            cy.get('form').submit();
          });
      });
  });
});
