import { LebenslaufAusbildungsArt } from '@dv/shared/model/gesuch';
import { LebenslaufEditorPO } from './lebenslauf-editor.po';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LebenslaufEditorPageActions {
  export const selectBildungsart = (optionValue: LebenslaufAusbildungsArt) => {
    LebenslaufEditorPO.getBildungsartField().click();
    return cy.get('mat-option').contains(optionValue).click();
  };
}
