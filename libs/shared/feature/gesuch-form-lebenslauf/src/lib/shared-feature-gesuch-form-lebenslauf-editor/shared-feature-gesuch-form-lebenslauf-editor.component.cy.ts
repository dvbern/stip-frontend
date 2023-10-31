import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LebenslaufAusbildungsArt } from '@dv/shared/model/gesuch';
import { SharedModelLebenslauf } from '@dv/shared/model/lebenslauf';
import { LebenslaufEditorPageActions } from '../../../cypress/support/lebenslauf-editor-page.actions';
import { LebenslaufEditorPO } from '../../../cypress/support/lebenslauf-editor.po';
import { SharedFeatureGesuchFormLebenslaufEditorComponent } from './shared-feature-gesuch-form-lebenslauf-editor.component';

describe(SharedFeatureGesuchFormLebenslaufEditorComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(
      SharedFeatureGesuchFormLebenslaufEditorComponent,
      {
        add: {
          imports: [],
          providers: [],
        },
      }
    );
  });

  describe('new AUSBILDUNG', () => {
    it('should initially display bildungsart, ausbildungAbgeschlossen, start and ende', () => {
      mountWithEmptyAusbildung();
      LebenslaufEditorPO.getBildungsartField().should('exist');
      LebenslaufEditorPO.getBerufsbezeichnungField().should('not.exist');
      LebenslaufEditorPO.getFachrichtungField().should('not.exist');
      LebenslaufEditorPO.getTitelDesAbschlussesField().should('not.exist');
      LebenslaufEditorPO.getBeginnField().should('exist');
      LebenslaufEditorPO.getEndeField().should('exist');
      LebenslaufEditorPO.getAusbildungAbgeschlossenField().should('exist');
      LebenslaufEditorPO.getTaetigkeitsartField().should('not.exist');
      LebenslaufEditorPO.getTaetigkeitsBeschreibungField().should('not.exist');
    });

    it('should display berufsbezeichnung if one of {EIDGENOESSISCHES_BERUFSATTEST, EIDGENOESSISCHES_FAEHIGKEITSZEUGNIS} is selected', () => {
      mountWithEmptyAusbildung();
      const bildungsartenWhichNeedBerufsbezeichnung = [
        LebenslaufAusbildungsArt.EIDGENOESSISCHES_BERUFSATTEST,
        LebenslaufAusbildungsArt.EIDGENOESSISCHES_FAEHIGKEITSZEUGNIS,
      ];
      const bildsartenWhichDontNeedBerufsbezeichnung = Object.values(
        LebenslaufAusbildungsArt
      ).filter(
        (ausbildungsart) =>
          !bildungsartenWhichNeedBerufsbezeichnung.includes(ausbildungsart)
      );

      for (const bildungsart of bildungsartenWhichNeedBerufsbezeichnung) {
        LebenslaufEditorPageActions.selectBildungsart(bildungsart);
        LebenslaufEditorPO.getBerufsbezeichnungField().should('exist');
      }

      for (const bildungsart of bildsartenWhichDontNeedBerufsbezeichnung) {
        LebenslaufEditorPageActions.selectBildungsart(bildungsart);
        LebenslaufEditorPO.getBerufsbezeichnungField().should('not.exist');
      }
    });

    it('should reset berufsbezeichnung if field is hidden', () => {
      mountWithEmptyAusbildung();
      const value = 'Mein Beruf';
      LebenslaufEditorPO.getBerufsbezeichnungField().should('not.exist');
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.EIDGENOESSISCHES_BERUFSATTEST
      );
      LebenslaufEditorPO.getBerufsbezeichnungField().should('exist');
      LebenslaufEditorPO.getBerufsbezeichnungField().click().type(value);
      LebenslaufEditorPO.getBerufsbezeichnungField()
        .find('input')
        .should('have.value', value);
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.FACHMATURITAET
      );
      LebenslaufEditorPO.getBerufsbezeichnungField().should('not.exist');
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.EIDGENOESSISCHES_BERUFSATTEST
      );
      LebenslaufEditorPO.getBerufsbezeichnungField().should('exist');
      LebenslaufEditorPO.getBerufsbezeichnungField()
        .find('input')
        .should('have.value', '');
    });

    it('should reset fachrichtung if field is hidden', () => {
      mountWithEmptyAusbildung();
      const value = 'Meine Fachrichtung';
      LebenslaufEditorPO.getFachrichtungField().should('not.exist');
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.BACHELOR_FACHHOCHSCHULE
      );
      LebenslaufEditorPO.getFachrichtungField().should('exist');
      LebenslaufEditorPO.getFachrichtungField().click().type(value);
      LebenslaufEditorPO.getFachrichtungField()
        .find('input')
        .should('have.value', value);
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.FACHMATURITAET
      );
      LebenslaufEditorPO.getFachrichtungField().should('not.exist');
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.BACHELOR_FACHHOCHSCHULE
      );
      LebenslaufEditorPO.getFachrichtungField().should('exist');
      LebenslaufEditorPO.getFachrichtungField()
        .find('input')
        .should('have.value', '');
    });

    it('should reset titelDesAbschlusses if field is hidden', () => {
      mountWithEmptyAusbildung();
      const value = 'Mein Beruf';
      LebenslaufEditorPO.getTitelDesAbschlussesField().should('not.exist');
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.ANDERER_BILDUNGSABSCHLUSS
      );
      LebenslaufEditorPO.getTitelDesAbschlussesField().should('exist');
      LebenslaufEditorPO.getTitelDesAbschlussesField().click().type(value);
      LebenslaufEditorPO.getTitelDesAbschlussesField()
        .find('input')
        .should('have.value', value);
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.FACHMATURITAET
      );
      LebenslaufEditorPO.getTitelDesAbschlussesField().should('not.exist');
      LebenslaufEditorPageActions.selectBildungsart(
        LebenslaufAusbildungsArt.ANDERER_BILDUNGSABSCHLUSS
      );
      LebenslaufEditorPO.getTitelDesAbschlussesField().should('exist');
      LebenslaufEditorPO.getTitelDesAbschlussesField()
        .find('input')
        .should('have.value', '');
    });

    it('should display fachrichtung if one of {BACHELOR_HOCHSCHULE_UNI, BACHELOR_FACHHOCHSCHULE, MASTER} is selected', () => {
      mountWithEmptyAusbildung();
      const bildungsartenWhichNeedFachrichtung = [
        LebenslaufAusbildungsArt.BACHELOR_HOCHSCHULE_UNI,
        LebenslaufAusbildungsArt.BACHELOR_FACHHOCHSCHULE,
        LebenslaufAusbildungsArt.MASTER,
      ];
      const bildungsartenWhichDontNeedFachrichtung = Object.values(
        LebenslaufAusbildungsArt
      ).filter(
        (ausbildungsart) =>
          !bildungsartenWhichNeedFachrichtung.includes(ausbildungsart)
      );

      for (const bildungsart of bildungsartenWhichNeedFachrichtung) {
        LebenslaufEditorPageActions.selectBildungsart(bildungsart);
        LebenslaufEditorPO.getFachrichtungField().should('exist');
      }

      for (const bildungsart of bildungsartenWhichDontNeedFachrichtung) {
        LebenslaufEditorPageActions.selectBildungsart(bildungsart);
        LebenslaufEditorPO.getFachrichtungField().should('not.exist');
      }
    });

    it('should display titelDesAbschlusses if ANDERER_BILDUNGSABSCHLUSS is selected', () => {
      mountWithEmptyAusbildung();
      const bildungsartenWhichNeedTitelDesAbschlusses = [
        LebenslaufAusbildungsArt.ANDERER_BILDUNGSABSCHLUSS,
      ];
      const bildungsartenWhichDontNeedTitelDesAbschlusses = Object.values(
        LebenslaufAusbildungsArt
      ).filter(
        (ausbildungsart) =>
          !bildungsartenWhichNeedTitelDesAbschlusses.includes(ausbildungsart)
      );

      for (const bildungsart of bildungsartenWhichNeedTitelDesAbschlusses) {
        LebenslaufEditorPageActions.selectBildungsart(bildungsart);
        LebenslaufEditorPO.getTitelDesAbschlussesField().should('exist');
      }

      for (const bildungsart of bildungsartenWhichDontNeedTitelDesAbschlusses) {
        LebenslaufEditorPageActions.selectBildungsart(bildungsart);
        LebenslaufEditorPO.getTitelDesAbschlussesField().should('not.exist');
      }
    });
  });

  describe('new TAETIGKEIT', () => {
    it('should not have ausbildungspezifisch fields', () => {
      mountWithEmptyTaetigkeit();
      LebenslaufEditorPO.getBildungsartField().should('not.exist');
      LebenslaufEditorPO.getFachrichtungField().should('not.exist');
      LebenslaufEditorPO.getBerufsbezeichnungField().should('not.exist');
      LebenslaufEditorPO.getTitelDesAbschlussesField().should('not.exist');
      LebenslaufEditorPO.getAusbildungAbgeschlossenField().should('not.exist');

      LebenslaufEditorPO.getTaetigkeitsartField().should('exist');
      LebenslaufEditorPO.getTaetigkeitsBeschreibungField().should('exist');
    });
  });
});

function mountWithEmptyAusbildung(): void {
  mountWithEmpty('AUSBILDUNG');
}

function mountWithEmptyTaetigkeit(): void {
  mountWithEmpty('TAETIGKEIT');
}

function mountWithEmpty(type: SharedModelLebenslauf['type']): void {
  cy.mount(SharedFeatureGesuchFormLebenslaufEditorComponent, {
    imports: [
      TranslateTestingModule.withTranslations({}),
      BrowserAnimationsModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          language: { language: 'de' },
          gesuchs: { gesuchFormular: {} },
        },
      }),
    ],
    componentProperties: {
      item: {
        type,
      },
      ausbildungen: [],
    },
  });
}
