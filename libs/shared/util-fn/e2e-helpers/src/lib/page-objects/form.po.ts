export const getSubmitButton = (subject?: HTMLElement) =>
  cy.get('button[type=submit]', { withinSubject: subject });
