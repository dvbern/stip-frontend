export namespace SharedEinnahmenKostenInAusbildungPO {
  export const getFormLoading = () =>
    cy.getBySel('form-einnahmen-kosten-loading');

  export const getFormDataIncompleteWarning = () =>
    cy.getBySel('gesuch-form-einnahmenkosten-data-incomplete-warning');

  export const getFormNettoerwerbseinkommen = () =>
    cy.getBySel('form-einnahmen-kosten-nettoerwerbseinkommen');

  export const getFormAlimente = () =>
    cy.getBySel('form-einnahmen-kosten-alimente');
}
