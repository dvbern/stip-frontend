import { SharedModelGesuchFormular, Zivilstand } from '@dv/shared/model/gesuch';
import { GesuchAppModelGesuchFormStep } from './gesuch-app-model-gesuch-form';

export const GesuchFormSteps = {
  PERSON: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-person',
    translationKey: 'gesuch-app.form.person.title',
    currentStepNumber: 1,
    iconSymbolName: 'person',
  },

  AUSBILDUNG: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-education',
    translationKey: 'gesuch-app.form.education.title',
    currentStepNumber: 2,
    iconSymbolName: 'school',
  },

  LEBENSLAUF: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-lebenslauf',
    translationKey: 'gesuch-app.form.lebenslauf.title',
    currentStepNumber: 3,
    iconSymbolName: 'news',
  },

  FAMILIENSITUATION: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-familiensituation',
    translationKey: 'gesuch-app.familiensituation.title',
    currentStepNumber: 4,
    iconSymbolName: 'family_restroom',
  },

  ELTERN: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-eltern',
    translationKey: 'gesuch-app.form.eltern.title',
    currentStepNumber: 5,
    iconSymbolName: 'escalator_warning',
  },

  GESCHWISTER: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-geschwister',
    translationKey: 'gesuch-app.form.geschwister.title',
    currentStepNumber: 6,
    iconSymbolName: 'group',
  },

  PARTNER: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-partner',
    translationKey: 'gesuch-app.form.partner.title',
    currentStepNumber: 7,
    iconSymbolName: 'favorite',
  },

  KINDER: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-kinder',
    translationKey: 'gesuch-app.form.kinder.title',
    currentStepNumber: 8,
    iconSymbolName: 'emoji_people',
  },

  AUSZAHLUNGEN: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-auszahlungen',
    translationKey: 'gesuch-app.auszahlung.title',
    currentStepNumber: 9,
    iconSymbolName: 'payments',
  },

  EINNAHMEN_KOSTEN: <GesuchAppModelGesuchFormStep>{
    route: 'gesuch-app-feature-gesuch-form-einnahmenkosten',
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
