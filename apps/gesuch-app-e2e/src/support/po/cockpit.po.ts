// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CockpitPO {
  export const getPeriodeTitle = () => cy.getBySel('cockpit-periode-title');
  export const getGesuchEdit = () => cy.getBySel('cockpit-gesuch-edit');
  export const getGesuchRemove = () => cy.getBySel('cockpit-gesuch-remove');
  export const getNavDashboard = () => cy.getBySel('cockpit-nav-dashboard');
}
