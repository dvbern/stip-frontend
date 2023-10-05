export namespace SharedEducationPO {
  export const getFormBeginnDerAusbildung = () =>
    cy.getBySel('form-education-beginn-der-ausbildung');

  export const getFormEndeDerAusbildung = () =>
    cy.getBySel('form-education-ende-der-ausbildung');

  export const getForm = () => cy.getBySel('form-education-form');
}
