import {
  getFormPersonActionBack,
  getFormPersonLoading,
  getFormPersonName,
} from '../support/form-person.po';
import { getGesuchDescription, getGesuchEdit } from '../support/cockpit.po';

describe('gesuch-app gesuch form', () => {
  beforeEach(() => cy.visit('/'));

  it('should edit and revert person form', () => {
    getGesuchEdit().first().click();
    getFormPersonName().should('exist');
    getFormPersonLoading().should('not.exist');
    getFormPersonName().focus();
    getFormPersonName().clear();
    getFormPersonName().type('Updated', { force: true });
    getFormPersonActionBack().click();
    getGesuchDescription().first().should('contain.text', 'Updated');

    // revert mock data
    getGesuchEdit().first().click();
    getFormPersonLoading().should('not.exist');
    getFormPersonName().focus();
    getFormPersonName().clear();
    getFormPersonName().type('Trajan');
    getFormPersonActionBack().click();
  });
});
