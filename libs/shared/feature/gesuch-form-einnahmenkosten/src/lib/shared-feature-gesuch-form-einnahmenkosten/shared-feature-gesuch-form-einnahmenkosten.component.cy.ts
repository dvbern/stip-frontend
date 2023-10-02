import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Ausbildung,
  GesuchFormularUpdate,
  PersonInAusbildung,
} from '@dv/shared/model/gesuch';
import { SharedEinnahmenKostenInAusbildungPO } from '@dv/shared/util-fn/e2e-helpers';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SharedFeatureGesuchFormEinnahmenkostenComponent } from './shared-feature-gesuch-form-einnahmenkosten.component';

describe(SharedFeatureGesuchFormEinnahmenkostenComponent.name, async () => {
  TestBed.overrideComponent(SharedFeatureGesuchFormEinnahmenkostenComponent, {
    add: {
      imports: [],
      providers: [],
    },
  });

  describe('should display warning if not all of personInAusbildung, familiensituation, ausbildung are defined', () => {
    it('should display warning if personInAusbildung is undefined', () => {
      mountWithInitialGesuchsformular({
        personInAusbildung: undefined,
        ausbildung: createEmptyAusbildung(),
        familiensituation: { elternVerheiratetZusammen: true },
      });
      SharedEinnahmenKostenInAusbildungPO.getFormDataIncompleteWarning().should(
        'exist'
      );
    });
    it('should display warning if ausbildung is undefined', () => {
      mountWithInitialGesuchsformular({
        personInAusbildung: createEmptyPersonInAusbildung(),
        ausbildung: undefined,
        familiensituation: { elternVerheiratetZusammen: true },
      });
      SharedEinnahmenKostenInAusbildungPO.getFormDataIncompleteWarning().should(
        'exist'
      );
    });
    it('should display warning if familiensituation is undefined', () => {
      mountWithInitialGesuchsformular({
        personInAusbildung: createEmptyPersonInAusbildung(),
        ausbildung: createEmptyAusbildung(),
        familiensituation: undefined,
      });
      SharedEinnahmenKostenInAusbildungPO.getFormDataIncompleteWarning().should(
        'exist'
      );
    });
  });

  it('should not display alimente field if gerichtlicheAlimentenregelung is undefined', () => {
    mountWithInitialGesuchsformular({
      personInAusbildung: createEmptyPersonInAusbildung(),
      ausbildung: createEmptyAusbildung(),
      familiensituation: { elternVerheiratetZusammen: true },
    });
    SharedEinnahmenKostenInAusbildungPO.getFormDataIncompleteWarning().should(
      'not.exist'
    );
    SharedEinnahmenKostenInAusbildungPO.getFormAlimente().should('not.exist');
  });

  it('should not display alimente field if gerichtlicheAlimentenregelung is false', () => {
    mountWithInitialGesuchsformular({
      personInAusbildung: createEmptyPersonInAusbildung(),
      ausbildung: createEmptyAusbildung(),
      familiensituation: {
        elternVerheiratetZusammen: false,
        gerichtlicheAlimentenregelung: false,
      },
    });
    SharedEinnahmenKostenInAusbildungPO.getFormDataIncompleteWarning().should(
      'not.exist'
    );
    SharedEinnahmenKostenInAusbildungPO.getFormAlimente().should('not.exist');
  });

  it('should display alimente field if gerichtlicheAlimentenregelung is true', () => {
    mountWithInitialGesuchsformular({
      personInAusbildung: createEmptyPersonInAusbildung(),
      ausbildung: createEmptyAusbildung(),
      familiensituation: {
        elternVerheiratetZusammen: false,
        gerichtlicheAlimentenregelung: true,
      },
    });
    SharedEinnahmenKostenInAusbildungPO.getFormDataIncompleteWarning().should(
      'not.exist'
    );
    SharedEinnahmenKostenInAusbildungPO.getFormAlimente().should('exist');
  });
});

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
    ],
  });
}
