import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
import { capitalized } from '@dv/shared/util-fn/string-helper';
import {
  getSubmitButton,
  getStepLebenslauf,
  getStepTitle,
  SharedLebenslaufPO,
} from '@dv/shared/util-fn/e2e-helpers';

import { CockpitPO } from '../../support/po/cockpit.po';

describe('sachbearbeitung-app gesuch form', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  (
    [['AUSBILDUNG'], ['TAETIGKEIT']] as [SharedModelLebenslauf['type']][]
  ).forEach(([type]) =>
    it(`should have correct required validators for ${capitalized(
      type
    )}`, () => {
      CockpitPO.openGesuch();
      getStepLebenslauf().click();
      getStepTitle().should('contain.text', 'Lebenslauf');
      SharedLebenslaufPO.getFormLebenslaufLoading().should('not.exist');

      // Name auslesen
      SharedLebenslaufPO.getFirstTimelineGapBlock().should('exist');
      SharedLebenslaufPO.getAddButton(type).click();
      getSubmitButton().click();
      SharedLebenslaufPO.getArtInput(type).should('have.class', 'ng-invalid');
    })
  );
});
