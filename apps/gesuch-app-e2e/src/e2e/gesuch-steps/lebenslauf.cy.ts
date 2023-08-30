import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
import { capitalized } from '@dv/shared/util-fn/string-helper';

import { CockpitPO } from '../../support/po/cockpit.po';
import { LebenslaufPO } from '../../support/po/gesuch-steps/lebenslauf.po';
import {
  getStepLebenslauf,
  getStepTitle,
} from '../../support/shared/gesuch-steps.nav.po';
import { getSubmitButton } from '../../support/shared/form.po';

describe('gesuch-app gesuch form', () => {
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
      LebenslaufPO.getFormLebenslaufLoading().should('not.exist');

      // Name auslesen
      LebenslaufPO.getFirstTimelineGapBlock().should('exist');
      LebenslaufPO.getAddButton(type).click();
      getSubmitButton().click();
      LebenslaufPO.getArtInput(type).should('have.class', 'ng-invalid');
    })
  );
});
