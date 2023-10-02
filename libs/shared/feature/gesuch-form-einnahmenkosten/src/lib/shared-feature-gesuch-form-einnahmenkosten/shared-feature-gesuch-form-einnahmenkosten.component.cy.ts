import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Ausbildung,
  GesuchFormularUpdate,
  PersonInAusbildung,
  Wohnsitz,
} from '@dv/shared/model/gesuch';
import { SharedEinnahmenKostenInAusbildungPO } from '@dv/shared/util-fn/e2e-helpers';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { provideMaterialDefaultOptions } from '@dv/shared/pattern/angular-material-config';
import { SharedFeatureGesuchFormEinnahmenkostenComponent } from './shared-feature-gesuch-form-einnahmenkosten.component';

describe(SharedFeatureGesuchFormEinnahmenkostenComponent.name, async () => {
  TestBed.overrideComponent(SharedFeatureGesuchFormEinnahmenkostenComponent, {
    add: {
      imports: [],
      providers: [],
    },
  });

  describe('visibility rules for field "auswaertigeMittagessenProWoche"', () => {
    it('should not display auswaertigeMittagessenProWoche if personInAusbildung has wohnsitz "eigener Haushalt"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
      SharedEinnahmenKostenInAusbildungPO.getFormAuswaertigeMittagessenProWoche().should(
        'not.exist'
      );
    });

    it('should not display auswaertigeMittagessenProWoche if personInAusbildung has wohnsitz "Familie"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.FAMILIE);
      SharedEinnahmenKostenInAusbildungPO.getFormAuswaertigeMittagessenProWoche().should(
        'exist'
      );
    });

    it('should not display auswaertigeMittagessenProWoche if personInAusbildung has wohnsitz "Mutter Vater"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.MUTTER_VATER);
      SharedEinnahmenKostenInAusbildungPO.getFormAuswaertigeMittagessenProWoche().should(
        'exist'
      );
    });
  });
  describe('visibility rules for field "wohnkosten"', () => {
    it('should display wohnkosten if personInAusbildung has wohnsitz "eigener Haushalt"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
      SharedEinnahmenKostenInAusbildungPO.getFormWohnkosten().should('exist');
    });

    it('should not display wohnkosten if personInAusbildung has wohnsitz "Familie"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.FAMILIE);
      SharedEinnahmenKostenInAusbildungPO.getFormWohnkosten().should(
        'not.exist'
      );
    });

    it('should not display wohnkosten if personInAusbildung has wohnsitz "Mutter Vater"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.MUTTER_VATER);
      SharedEinnahmenKostenInAusbildungPO.getFormWohnkosten().should(
        'not.exist'
      );
    });
  });
  describe('visibility rules for field "personenImHaushalt"', () => {
    it('should display personenImHaushalt if personInAusbildung has wohnsitz "eigener Haushalt"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'exist'
      );
    });

    it('should not display personenImHaushalt if personInAusbildung has wohnsitz "Familie"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.FAMILIE);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'not.exist'
      );
    });

    it('should not display personenImHaushalt if personInAusbildung has wohnsitz "Mutter Vater"', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.MUTTER_VATER);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'not.exist'
      );
    });
  });
  describe('form validation', () => {
    it('should be invalid if personenImHaushalt is 0', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'exist'
      );
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().type(0);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'have.value',
        1
      );
    });
    it('should be invalid if personenImHaushalt is negative', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'exist'
      );
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().type(-2);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'have.value',
        2
      );
    });
    it('should be invalid if personenImHaushalt is positive', () => {
      mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'exist'
      );
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().type(1);
      SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
        'have.value',
        1
      );
    });
  });
});

function mountWithPreparedGesuchWithWohnsitz(wohnsitz: Wohnsitz): void {
  const gesuchFormular: GesuchFormularUpdate = {
    familiensituation: { elternVerheiratetZusammen: true },
    personInAusbildung: createEmptyPersonInAusbildung(),
    ausbildung: createEmptyAusbildung(),
  };
  if (gesuchFormular.personInAusbildung === undefined) {
    throw new Error('wrong Testsetup');
  }
  gesuchFormular.personInAusbildung.wohnsitz = wohnsitz;
  mountWithInitialGesuchsformular(gesuchFormular);
}

function createEmptyAusbildung(): Ausbildung {
  return {
    ausbildungsland: 'SCHWEIZ',
    fachrichtung: '',
    ausbildungBegin: '',
    ausbildungEnd: '',
    pensum: 'VOLLZEIT',
  };
}

function createEmptyPersonInAusbildung(): PersonInAusbildung {
  return {
    adresse: {
      land: 'CH',
      strasse: '',
      ort: '',
      plz: '',
    },
    sozialversicherungsnummer: '',
    anrede: 'FRAU',
    vorname: '',
    nachname: '',
    identischerZivilrechtlicherWohnsitz: true,
    geburtsdatum: '',
    email: '',
    telefonnummer: '',
    wohnsitz: 'FAMILIE',
    nationalitaet: 'CH',
    quellenbesteuert: false,
    heimatort: '',
    sozialhilfebeitraege: false,
    digitaleKommunikation: true,
    korrespondenzSprache: 'DEUTSCH',
  };
}

function mountWithInitialGesuchsformular(gesuchFormular: GesuchFormularUpdate) {
  cy.mount(SharedFeatureGesuchFormEinnahmenkostenComponent, {
    imports: [
      TranslateTestingModule.withTranslations({}),
      NoopAnimationsModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          ausbildungsstaettes: { ausbildungsstaettes: [] },
          gesuchs: {
            gesuchFormular: gesuchFormular,
          },
        },
      }),
      provideMaterialDefaultOptions(),
    ],
  });
}
