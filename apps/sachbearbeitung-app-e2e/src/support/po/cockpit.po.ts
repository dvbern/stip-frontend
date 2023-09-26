import {
  getStepTitle,
  SharedPersonInAusbildungPO,
} from '@dv/shared/util-fn/e2e-helpers';

export namespace CockpitPO {
  export const getTitle = () => cy.getBySel('cockpit-title');
  export const getList = () => cy.getBySel('cockpit-table');
  export const getRows = () => cy.getBySel('cockpit-table').get('tbody tr');

  export const openGesuch = () => {
    CockpitPO.getRows().first().click();
    getStepTitle().should('contain.text', 'Person in Ausbildung');
    SharedPersonInAusbildungPO.getFormPersonName().should('exist');
  };
}
