import { SharedModelGesuchFormular, Zivilstand } from '@dv/shared/model/gesuch';
import { GesuchAppModelGesuchFormStep } from './shared-model-gesuch-form';

export const GesuchFormSteps = {
  PERSON: <GesuchAppModelGesuchFormStep>{
    route: 'person',
    translationKey: 'gesuch-app.form.person.title',
    currentStepNumber: 1,
    iconSymbolName: 'person',
  },

  AUSBILDUNG: <GesuchAppModelGesuchFormStep>{
    route: 'education',
    translationKey: 'gesuch-app.form.education.title',
    currentStepNumber: 2,
    iconSymbolName: 'school',
  },

  LEBENSLAUF: <GesuchAppModelGesuchFormStep>{
    route: 'lebenslauf',
    translationKey: 'gesuch-app.form.lebenslauf.title',
    currentStepNumber: 3,
    iconSymbolName: 'news',
  },

  FAMILIENSITUATION: <GesuchAppModelGesuchFormStep>{
    route: 'familiensituation',
    translationKey: 'gesuch-app.familiensituation.title',
    currentStepNumber: 4,
    iconSymbolName: 'family_restroom',
  },

  ELTERN: <GesuchAppModelGesuchFormStep>{
    route: 'eltern',
    translationKey: 'gesuch-app.form.eltern.title',
    currentStepNumber: 5,
    iconSymbolName: 'escalator_warning',
  },

  GESCHWISTER: <GesuchAppModelGesuchFormStep>{
    route: 'geschwister',
    translationKey: 'gesuch-app.form.geschwister.title',
    currentStepNumber: 6,
    iconSymbolName: 'group',
  },

  PARTNER: <GesuchAppModelGesuchFormStep>{
    route: 'partner',
    translationKey: 'gesuch-app.form.partner.title',
    currentStepNumber: 7,
    iconSymbolName: 'favorite',
  },

  KINDER: <GesuchAppModelGesuchFormStep>{
    route: 'kinder',
    translationKey: 'gesuch-app.form.kinder.title',
    currentStepNumber: 8,
    iconSymbolName: 'emoji_people',
  },

  AUSZAHLUNGEN: <GesuchAppModelGesuchFormStep>{
    route: 'auszahlungen',
    translationKey: 'gesuch-app.auszahlung.title',
    currentStepNumber: 9,
    iconSymbolName: 'payments',
  },

  EINNAHMEN_KOSTEN: <GesuchAppModelGesuchFormStep>{
    route: 'einnahmenkosten',
    translationKey: 'gesuch-app.einnahmenkosten.title',
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
    default:
      return false;
  }
};
