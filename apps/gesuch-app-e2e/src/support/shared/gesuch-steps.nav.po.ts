export const getNavDashboard = () => cy.getBySel('gesuch-step-nav-dashboard');

export const getStep = (step: string) => cy.getBySel('step-nav-' + step);

export const getStepPersonInAusbildung = () => getStep('person');
export const getStepLebenslauf = () => getStep('lebenslauf');
export const getStepEinnahmenKostenAusbildung = () =>
  getStep('einnahmenkosten');
export const getStepTitle = () => cy.getBySel('step-title');
