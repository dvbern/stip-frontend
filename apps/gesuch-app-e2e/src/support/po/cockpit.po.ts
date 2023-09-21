import {
  getStepTitle,
  SharedPersonInAusbildungPO,
} from '@dv/shared/util-fn/e2e-helpers';

export namespace CockpitPO {
  export const getPeriodeTitle = () => cy.getBySel('cockpit-periode-title');
  export const getGesuchEdit = () => cy.getBySel('cockpit-gesuch-edit');
  export const getGesuchRemove = () => cy.getBySel('cockpit-gesuch-remove');
  export const getNavDashboard = () => cy.getBySel('cockpit-nav-dashboard');

  export const openGesuch = () => {
    CockpitPO.getGesuchEdit().first().click();
    getStepTitle().should('contain.text', 'Person in Ausbildung');
    SharedPersonInAusbildungPO.getFormPersonName().should('exist');
  };
}
