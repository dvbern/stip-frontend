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
import { SharedFeatureGesuchFormEinnahmenkostenComponent } from './shared-feature-gesuch-form-einnahmenkosten.component';

describe(SharedFeatureGesuchFormEinnahmenkostenComponent.name, async () => {
  TestBed.overrideComponent(SharedFeatureGesuchFormEinnahmenkostenComponent, {
    add: {
      imports: [],
      providers: [],
    },
  });

  it('should display fields wohnkosten and personenImHaushalt if personInAusbildung has wohnsitz "eigener Haushalt"', () => {
    mountWithPreparedGesuchWithWohnsitz(Wohnsitz.EIGENER_HAUSHALT);
    SharedEinnahmenKostenInAusbildungPO.getFormWohnkosten().should('exist');
    SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
      'exist'
    );
  });

  it('should not display fields wohnkosten and personenImHaushalt if personInAusbildung has wohnsitz "Familie"', () => {
    mountWithPreparedGesuchWithWohnsitz(Wohnsitz.FAMILIE);
    SharedEinnahmenKostenInAusbildungPO.getFormWohnkosten().should('not.exist');
    SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
      'not.exist'
    );
  });

  it('should not display fields wohnkosten and personenImHaushalt if personInAusbildung has wohnsitz "Mutter Vater"', () => {
    mountWithPreparedGesuchWithWohnsitz(Wohnsitz.MUTTER_VATER);
    SharedEinnahmenKostenInAusbildungPO.getFormWohnkosten().should('not.exist');
    SharedEinnahmenKostenInAusbildungPO.getFormPersonenImHaushalt().should(
      'not.exist'
    );
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
    ],
  });
}
