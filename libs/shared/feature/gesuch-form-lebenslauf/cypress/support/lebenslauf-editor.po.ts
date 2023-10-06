// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LebenslaufEditorPO {
  export const getBildungsartField = () =>
    cy.getBySel('lebenslauf-editor-ausbildungsart');

  export const getBerufsbezeichnungField = () =>
    cy.getBySel('lebenslauf-editor-berufsbezeichnung');
  export const getFachrichtungField = () =>
    cy.getBySel('lebenslauf-editor-fachrichtung');
  export const getTitelDesAbschlussesField = () =>
    cy.getBySel('lebenslauf-editor-titel-des-abschlusses');
  export const getAusbildungAbgeschlossenField = () =>
    cy.getBySel('lebenslauf-editor-ausbildung-abgeschlossen');
  export const getTaetigkeitsartField = () =>
    cy.getBySel('lebenslauf-editor-taetigkeitsart');
  export const getTaetigkeitsBeschreibungField = () =>
    cy.getBySel('lebenslauf-editor-taetigkeits-beschreibung');
  export const getBeginnField = () => cy.getBySel('lebenslauf-editor-beginn');
  export const getEndeField = () => cy.getBySel('lebenslauf-editor-ende');
}
