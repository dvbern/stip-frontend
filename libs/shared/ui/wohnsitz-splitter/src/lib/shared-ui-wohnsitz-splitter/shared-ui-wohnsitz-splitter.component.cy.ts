import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { SharedUiWohnsitzSplitterComponent } from './shared-ui-wohnsitz-splitter.component';
import { addWohnsitzControls } from '../utils/form';

const getInput = (type: 'a' | 'b') =>
  cy.get(`[data-testid="component-percentage-splitter-${type}"]`);

describe(SharedUiWohnsitzSplitterComponent.name, () => {
  const fb = new FormBuilder().nonNullable;

  const initializeControls = () => {
    const form = fb.group(addWohnsitzControls(fb));
    return form;
  };

  it('should show component with empty values', () => {
    cy.mount(SharedUiWohnsitzSplitterComponent, {
      imports: [
        TranslateTestingModule.withTranslations({}),
        NoopAnimationsModule,
      ],
      componentProperties: {
        controls: initializeControls().controls,
      },
    });
    getInput('a').should('have.value', '');
    getInput('b').should('have.value', '');
  });

  [
    [10, '10%', '90%'],
    [0, '0%', '100%'],
    [100, '100%', '0%'],
    [-1, '1%', '99%'],
    [1.99, '1.99%', '99%'],
    [300, '100%', '0%'],
  ].forEach(([value, expectedA, expectedB]) =>
    it(`should show component with valueA: [${value}] to be A('${expectedA}') B('${expectedB}')`, () => {
      const { controls } = initializeControls();
      cy.mount(SharedUiWohnsitzSplitterComponent, {
        imports: [
          TranslateTestingModule.withTranslations({}),
          NoopAnimationsModule,
        ],
        componentProperties: {
          controls,
        },
      });
      getInput('a').focus();
      getInput('a').type(value.toString());
      getInput('a').should('have.value', expectedA);
      getInput('b').should('have.value', expectedB);
    })
  );
});
