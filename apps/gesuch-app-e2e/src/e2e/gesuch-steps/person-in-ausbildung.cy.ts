import { CockpitPO } from '../../support/po/cockpit.po';
import { PersonInAusbildungPO } from '../../support/po/gesuch-steps/person-in-ausbildung.po';
import {
  getNavDashboard,
  getStepPersonInAusbildung,
  getStepTitle,
} from '../../support/shared/gesuch-steps.nav.po';

describe('gesuch-app gesuch form', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.selectUser('Philipp');
  });

  it('should edit and revert person form', () => {
    CockpitPO.openGesuch();
    getStepPersonInAusbildung().click();
    getStepTitle().should('contain.text', 'Person in Ausbildung');
    PersonInAusbildungPO.getFormPersonLoading().should('not.exist');

    // Name auslesen
    PersonInAusbildungPO.getFormPersonName()
      .invoke('val')
      .then((prevName) => {
        // Name updaten
        PersonInAusbildungPO.getFormPersonName().focus();
        PersonInAusbildungPO.getFormPersonName().clear();
        PersonInAusbildungPO.getFormPersonName().type('Updated name');

        // speichern und weiter
        cy.get('form').submit();
        getStepTitle().should('contain.text', 'Ausbildung');

        // zurueck zu Person in Ausbildung
        getNavDashboard().click();
        CockpitPO.getPeriodeTitle().should('exist');
        CockpitPO.getGesuchEdit().first().click();
        getStepPersonInAusbildung().click();
        getStepTitle().should('contain.text', 'Person in Ausbildung');
        PersonInAusbildungPO.getFormPersonName()
          .invoke('val')
          .then((updatedName) => {
            // CHECK: Name muss geaendert worden sein
            expect(updatedName === 'Updated name');

            // RESET: Name zuruecksetzen
            PersonInAusbildungPO.getFormPersonName().focus();
            PersonInAusbildungPO.getFormPersonName().clear();
            PersonInAusbildungPO.getFormPersonName().type(prevName);
            cy.get('form').submit();
          });
      });
  });
});
