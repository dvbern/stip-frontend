import { CockpitPO } from '../../support/po/cockpit.po';
import { PersonInAusbildungPO } from '../../support/po/gesuch-steps/person-in-ausbildung.po';
import {
  getNavDashboard,
  getStepPersonInAusbildung,
  getStepTitle,
} from '../../support/shared/gesuch-steps.nav.po';

describe('gesuch-app gesuch form', () => {
  beforeEach(() => cy.visit('/'));

  it('should edit and revert person form', () => {
    // erstes Gesuch oeffnen
    CockpitPO.getGesuchEdit().first().click();
    getStepPersonInAusbildung().click();
    getStepTitle().should('contain.text', 'Person in Ausbildung');
    PersonInAusbildungPO.getFormPersonLoading().should('exist');
    PersonInAusbildungPO.getFormPersonName().should('exist');
    PersonInAusbildungPO.getFormPersonLoading().should('not.exist');

    // Name auslesen
    PersonInAusbildungPO.getFormPersonName()
      .invoke('val')
      .then((prevName) => {
        // Name updaten
        PersonInAusbildungPO.getFormPersonName().focus();
        PersonInAusbildungPO.getFormPersonName().clear();
        PersonInAusbildungPO.getFormPersonName().type('Updated name', {
          force: true,
        });

        // speichern und weiter
        cy.get('form').submit();
        getStepTitle().invoke('text').should('equal', 'Ausbildung');

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
            PersonInAusbildungPO.getFormPersonName().type(prevName, {
              force: true,
            });
            cy.get('form').submit();
          });
      });
  });
});
