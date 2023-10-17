import { SharedModelGesuchFormular, Zivilstand } from '@dv/shared/model/gesuch';
import { SharedModelGesuchFormStep } from './shared-model-gesuch-form';

export const GesuchFormSteps = {
  PERSON: <SharedModelGesuchFormStep>{
    route: 'person',
    translationKey: 'shared.person.title',
    currentStepNumber: 1,
    iconSymbolName: 'person',
  },

  AUSBILDUNG: <SharedModelGesuchFormStep>{
    route: 'education',
    translationKey: 'shared.education.title',
    currentStepNumber: 2,
    iconSymbolName: 'school',
  },

  LEBENSLAUF: <SharedModelGesuchFormStep>{
    route: 'lebenslauf',
    translationKey: 'shared.lebenslauf.title',
    currentStepNumber: 3,
    iconSymbolName: 'news',
  },

  FAMILIENSITUATION: <SharedModelGesuchFormStep>{
    route: 'familiensituation',
    translationKey: 'shared.familiensituation.title',
    currentStepNumber: 4,
    iconSymbolName: 'family_restroom',
  },

  ELTERN: <SharedModelGesuchFormStep>{
    route: 'eltern',
    translationKey: 'shared.eltern.title',
    currentStepNumber: 5,
    iconSymbolName: 'escalator_warning',
  },

  GESCHWISTER: <SharedModelGesuchFormStep>{
    route: 'geschwister',
    translationKey: 'shared.geschwister.title',
    currentStepNumber: 6,
    iconSymbolName: 'group',
  },

  PARTNER: <SharedModelGesuchFormStep>{
    route: 'partner',
    translationKey: 'shared.partner.title',
    currentStepNumber: 7,
    iconSymbolName: 'favorite',
  },

  KINDER: <SharedModelGesuchFormStep>{
    route: 'kinder',
    translationKey: 'shared.kinder.title',
    currentStepNumber: 8,
    iconSymbolName: 'emoji_people',
  },

  AUSZAHLUNGEN: <SharedModelGesuchFormStep>{
    route: 'auszahlungen',
    translationKey: 'shared.auszahlung.title',
    currentStepNumber: 9,
    iconSymbolName: 'payments',
  },

  EINNAHMEN_KOSTEN: <SharedModelGesuchFormStep>{
    route: 'einnahmenkosten',
    translationKey: 'shared.einnahmenkosten.title',
    currentStepNumber: 10,
    iconSymbolName: 'call_missed_outgoing',
  },
} as const;
export type GesuchFormSteps = typeof GesuchFormSteps;

export const isStepDisabled = (
  step: keyof GesuchFormSteps,
  formular: SharedModelGesuchFormular | null
) => {
  switch (step) {
    case 'PARTNER': {
      const zivilstand = formular?.personInAusbildung?.zivilstand;
      return (
        !zivilstand ||
        ![
          Zivilstand.VERHEIRATET,
          Zivilstand.KONKUBINAT,
          Zivilstand.EINGETRAGENE_PARTNERSCHAFT,
        ].includes(zivilstand)
      );
    }
    case 'ELTERN': {
      const werZahltAlimente = formular?.familiensituation?.werZahltAlimente;
      const mutterUnbekanntVerstorben = formular?.familiensituation?.mutterUnbekanntVerstorben;
      const vaterUnbekanntVerstorben = formular?.familiensituation?.vaterUnbekanntVerstorben;
      return werZahltAlimente === 'GEMEINSAM' || (mutterUnbekanntVerstorben === 'VERSTORBEN' || mutterUnbekanntVerstorben === 'UNBEKANNT' && vaterUnbekanntVerstorben === 'VERSTORBEN' || vaterUnbekanntVerstorben === 'UNBEKANNT');
    }
    default:
      return false;
  }
};
