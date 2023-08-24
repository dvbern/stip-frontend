// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EinnahmenKostenInAusbildungPO {
  export const getFormLoading = () =>
    cy.getBySel('form-einnahmen-kosten-loading');
  export const getFormNettoerwerbseinkommen = () =>
    cy.getBySel('form-einnahmen-kosten-nettoerwerbseinkommen');
}
