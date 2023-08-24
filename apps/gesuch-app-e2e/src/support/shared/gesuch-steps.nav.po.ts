export const getNavDashboard = () => cy.getBySel('gesuch-step-nav-dashboard');

export const getStep = (step: string) =>
  cy.getBySel('step-nav-gesuch-app-feature-gesuch-form-' + step);

export const getStepPersonInAusbildung = () => getStep('person');
export const getStepEinnahmenKostenAusbildung = () =>
  getStep('einnahmenkosten');
export const getStepTitle = () => cy.getBySel('step-title');
